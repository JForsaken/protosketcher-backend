import { isEmpty, any, omit } from 'ramda';

import blueprint from './blueprint';
import { validator, queryBuilder } from '../helpers';
import Control from './model';
import Prototype from '../prototypes/model';
import Shape from '../shapes/model';
import ActionType from '../actiontypes/model';
import EventType from '../eventtypes/model';
import Page from '../pages/model';
import Text from '../texts/model';

const hasId = id => o => String(o._id) === id;
const allIdsInList = (haystack, list) => {
  let allInList = true;
  haystack.forEach((o) => {
    if (!any(hasId(o), list)) {
      allInList = false;
      return false;
    }
    return true;
  });

  return allInList;
};


/**
 * List all controls
 */
export const findAll = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to get controls for shapes with '${prototype.userId}' as owner`);
      } else {
        validator(req.query, blueprint.get.all)
          .then((validated) => {
            const { where, limit, projection, populate } = queryBuilder(validated);

            Control.find({ ...where, shapeId: req.params.shapeId })
              .limit(limit)
              .populate(populate)
              .select(projection)
              .then((controls) => {
                res.status(200).json(controls);
              })
              .catch(e => res.status(500).json(e));
          })
          .catch(e => res.status(400).json(e));
      }
    })
    .catch(e => res.status(500).json(e));
};

/**
 * List one control by id
 */
export const findOne = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to get control for shape with '${prototype.userId}' as owner`);
      } else {
        validator(req.query, blueprint.get.one)
          .then((validated) => {
            const { projection, populate } = queryBuilder(validated);

            Control.findOne({ _id: req.params.id, shapeId: req.params.shapeId })
              .populate(populate)
              .select(projection)
              .then((control) => {
                if (!control) {
                  res.status(404).end(`Couldn't find control with id '${req.params.id}'`);
                } else {
                  res.status(200).json(control);
                }
              })
              .catch(e => res.status(500).json(e));
          })
          .catch(e => res.status(400).json(e));
      }
    })
    .catch(e => res.status(500).json(e));
};

/**
 * Add new control
 */
export const add = (req, res) => {
  validator(req.body, blueprint.post.add)
    .then((validated) => {
      // fetch requested prototype and shape in url
      Promise.all([
        Prototype.findOne({ _id: req.params.prototypeId }),
        Shape.findOne({ _id: req.params.shapeId }),
      ])
        .then((urlValues) => {
          const prototype = urlValues[0];
          const shape = urlValues[1];

          // validate prototype
          if (!prototype) {
            res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
            // validate proper user
          } else if (req.decodedToken._id !== String(prototype.userId)) {
            res.status(403).end(`User with id '${req.decodedToken._id}' attempted to create control for shape with '${prototype.userId}' as owner`);
            // validate shape
          } else if (!shape) {
            res.status(404).end(`Couldn't find shape with id '${req.params.shapeId}'`);
          } else {
            // fetch all info needed for validation
            Promise.all([
              EventType.findOne({ _id: validated.eventTypeId }),
              ActionType.findOne({ _id: validated.actionTypeId }),
              Page.find({ prototypeId: req.params.prototypeId }),
              Shape.find({ pageId: shape.pageId }),
              Text.find({ pageId: shape.shapeId }),
            ]).then((info) => {
              const eventType = info[0];
              const actionType = info[1];
              const pages = info[2];
              const affectedShapes = info[3];
              const affectedTexts = info[4];

              // validate event type
              if (validated.eventTypeId && !eventType) {
                res.status(404).end(`Couldn't find event type with id '${validated.eventTypeId}'`);
              // validate action type
              } else if (validated.actionTypeId && !actionType) {
                res.status(404).end(`Couldn't find action type with id '${validated.actionTypeId}'`);
              // validate affectedPageId
              } else if (validated.affectedPageId &&
                         !any(hasId(validated.affectedPageId), pages)) {
                res.status(404).end(`Couldn't find page for specified affectedPageId with id '${validated.affectedPageId}'`);
              // validate affectedShapeIds
              } else if (!isEmpty(validated.affectedShapeIds) &&
                         (!allIdsInList(validated.affectedShapeIds, affectedShapes) ||
                          validated.affectedShapeIds.includes(String(shape._id)))) {
                res.status(404).end('The affectedShapeIds contain a non-existing shape, or the shape parent to this control');
              // validate affectedTexts
              } else if (validated.affectedTextIds &&
                         !isEmpty(validated.affectedTextIds) &&
                         (!allIdsInList(validated.affectedTextIds, affectedTexts))) {
                res.status(404).end('The affectedTextIds contain a non-existing text');
              // all validation passed
              } else {
                const control = new Control({
                  shapeId: req.params.shapeId,
                  ...omit(['uuid'], validated),
                });

                control.save((err, doc) => {
                  if (err) {
                    res.status(500).json(err);
                  } else {
                    res.status(200).json({ uuid: validated.uuid, ...doc._doc });
                  }
                });
              }
            }).catch(reason => res.status(500).end(reason));
          }
        }).catch(reason => res.status(500).end(reason));
    })
    .catch(e => res.status(400).json(e));
};

/**
 * Update one control by id
 */
export const update = (req, res) => {
  validator(req.body, blueprint.patch.one)
    .then((validated) => {
      // fetch requested prototype and shape in url
      Promise.all([
        Prototype.findOne({ _id: req.params.prototypeId }),
        Shape.findOne({ _id: req.params.shapeId }),
      ])
        .then((urlValues) => {
          const prototype = urlValues[0];
          const shape = urlValues[1];

          // validate prototype
          if (!prototype) {
            res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
            // validate proper user
          } else if (req.decodedToken._id !== String(prototype.userId)) {
            res.status(403).end(`User with id '${req.decodedToken._id}' attempted to create control for shape with '${prototype.userId}' as owner`);
            // validate shape
          } else if (!shape) {
            res.status(404).end(`Couldn't find shape with id '${req.params.shapeId}'`);
          } else {
            // fetch all info needed for validation
            Promise.all([
              EventType.findOne({ _id: validated.eventTypeId }),
              ActionType.findOne({ _id: validated.actionTypeId }),
              Page.find({ prototypeId: req.params.prototypeId }),
              Shape.find({ pageId: shape.pageId }),
              Text.find({ pageId: shape.shapeId }),
            ]).then((info) => {
              const eventType = info[0];
              const actionType = info[1];
              const pages = info[2];
              const affectedShapes = info[3];
              const affectedTexts = info[4];

              // validate event type
              if (validated.eventTypeId && !eventType) {
                res.status(404).end(`Couldn't find event type with id '${validated.eventTypeId}'`);
              // validate action type
              } else if (validated.actionTypeId && !actionType) {
                res.status(404).end(`Couldn't find action type with id '${validated.actionTypeId}'`);
              // validate affectedPageId
              } else if (validated.affectedPageId &&
                         !any(hasId(validated.affectedPageId), pages)) {
                res.status(404).end(`Couldn't find page for specified affectedPageId with id '${validated.affectedPageId}'`);
              // validate affectedShapeIds
              } else if (validated.affectedShapeIds &&
                         !isEmpty(validated.affectedShapeIds) &&
                         (!allIdsInList(validated.affectedShapeIds, affectedShapes) ||
                          validated.affectedShapeIds.includes(String(shape._id)))) {
                res.status(404).end('The affectedShapeIds contain a non-existing shape, or the shape parent to this control');
              // validate affectedTexts
              } else if (validated.affectedTextIds &&
                         !isEmpty(validated.affectedTextIds) &&
                         (!allIdsInList(validated.affectedTextIds, affectedTexts))) {
                res.status(404).end('The affectedTextIds contain a non-existing text');
              // all validation passed
              } else {
                Control.update({ _id: req.params.id }, { $set: validated })
                  .then(() => res.status(200).json({ ...validated, _id: req.params.id }))
                  .catch(e => res.status(500).json(e));
              }
            }).catch(reason => res.status(500).end(reason));
          }
        }).catch(reason => res.status(500).end(reason));
    })
    .catch(e => res.status(400).json(e));
};

/**
 * Remove one control by id
 */
export const remove = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to delete control for shape with '${prototype.userId}' as owner`);
      } else {
        Control.findOne({ _id: req.params.id, shapeId: req.params.shapeId })
          .then((control) => {
            if (!control) {
              res.status(404).end(`Couldn't find control with id '${req.params.id}'`);
            } else {
              control.remove()
                .then(() => {
                  res.status(200).json(control);
                })
                .catch(e => res.status(500).json(e));
            }
          })
          .catch(e => res.status(500).json(e));
      }
    })
    .catch(e => res.status(500).json(e));
};
