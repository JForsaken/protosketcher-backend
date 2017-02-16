import { isEmpty, has, any } from 'ramda';

import blueprint from './blueprint';
import { validator, queryBuilder } from '../helpers';
import Control from './model';
import Prototype from '../prototypes/model';
import Shape from '../shapes/model';
import ActionType from '../actiontypes/model';
import EventType from '../eventtypes/model';
import Page from '../pages/model';
import Text from '../texts/model';

const hasId = (id, inverse) => o => (inverse ? String(o._id) !== id : String(o._id) === id);
const allIdsInList = (haystack, list) => {
  let allInList = true;
  haystack.forEach((o) => {
    if (any(hasId(o, true), list)) {
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
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to create control for shape with '${prototype.userId}' as owner`);
      } else {
        Shape.findOne({ _id: req.params.shapeId })
          .then((shape) => {
            if (!shape) {
              res.status(404).end(`Couldn't find shape with id '${req.params.shapeId}'`);
            } else {
              validator(req.body, blueprint.post.add)
                .then((validated) => {
                  // validate the event type
                  EventType.findOne({ _id: validated.eventTypeId })
                    .then((eventType) => {
                      if (!eventType) {
                        res.status(404).end(`Couldn't find event type with id '${validated.eventTypeId}'`);
                      } else {
                        // validated the action type
                        ActionType.findOne({ _id: validated.actionTypeId })
                          .then((actionType) => {
                            if (!actionType) {
                              res.status(404).end(`Couldn't find action type with id '${validated.actionTypeId}'`);
                            } else {
                              // get all the pages of this prototype
                              Page.find({ prototypeId: req.params.prototypeId })
                                .then((pages) => {
                                  // get all the shapes of this page
                                  Shape.find({ pageId: shape.pageId })
                                    .then((affectedShapes) => {
                                      // get all the texts of this page
                                      Text.find({ pageId: shape.shapeId })
                                        .then((affectedTexts) => {
                                          // validate affectedPageId
                                          if (has('affectedPageId')(validated)
                                              && validated.affectedPageId !== null &&
                                              !any(hasId(validated.affectedPageId), pages)) {
                                            res.status(404).end("Couldn't find page for specified affectedPageId");
                                          // validated affectedShapeIds
                                          } else if (has('affectedShapeIds')(validated) &&
                                                     !isEmpty(validated.affectedShapeIds) &&
                                                     (!allIdsInList(validated.affectedShapeIds,
                                                                    affectedShapes) ||
                                                      validated.affectedShapeIds
                                                      .includes(String(shape._id)))) {
                                            res.status(404).end(' The affectedShapeIds contain a non-existing shape, or the shape parent to this control');
                                          // validated affectedTexts
                                          } else if (has('affectedTextIds')(validated) &&
                                                     !isEmpty(validated.affectedTextIds) &&
                                                     (!allIdsInList(validated.affectedTextIds,
                                                                    affectedTexts)
                                                     )) {
                                            res.status(404).end(' The affectedTextIds contain a non-existing text');
                                          // all validation passed
                                          } else {
                                            const control = new Control({
                                              shapeId: req.params.shapeId,
                                              ...validated,
                                            });

                                            control.save((err, doc) => {
                                              if (err) {
                                                res.status(500).json(err);
                                              } else {
                                                res.status(200).json(doc);
                                              }
                                            });
                                          }
                                        })
                                        .catch(e => res.status(500).json(e));
                                    })
                                    .catch(e => res.status(500).json(e));
                                })
                                .catch(e => res.status(500).json(e));
                            }
                          })
                          .catch(e => res.status(500).json(e));
                      }
                    })
                    .catch(e => res.status(500).json(e));
                })
                .catch(e => res.status(400).json(e));
            }
          })
          .catch(e => res.status(500).json(e));
      }
    })
    .catch(e => res.status(500).json(e));
};

/**
 * Update one control by id
 */
export const update = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to update control for shape with '${prototype.userId}' as owner`);
      } else {
        Control.findOne({ _id: req.params.id, shapeId: req.params.shapeId })
          .then((control) => {
            if (!control) {
              res.status(404).end(`Couldn't find control with id '${req.params.id}'`);
            } else {
              validator(req.body, blueprint.patch.one)
                .then((validated) => {
                  Shape.findOne({ _id: req.params.shapeId })
                    .then((shape) => {
                      if (!shape) {
                        res.status(404).end(`Couldn't find shape with id '${req.params.shapeId}'`);
                      } else {
                        // get all event types
                        EventType.find()
                          .then((eventTypes) => {
                            // get all action types
                            ActionType.find()
                              .then((actionTypes) => {
                                // get all the pages of this prototype
                                Page.find({ prototypeId: req.params.prototypeId })
                                  .then((pages) => {
                                    // get all the shapes of this page
                                    Shape.find({ pageId: shape.pageId })
                                      .then((affectedShapes) => {
                                        // get all the texts of this page
                                        Text.find({ pageId: shape.shapeId })
                                          .then((affectedTexts) => {
                                            // validate eventTypeId
                                            if (has('eventTypeId')(validated) &&
                                                validated.eventTypeId !== null &&
                                                !any(hasId(validated.eventTypeId), eventTypes)) {
                                              res.status(404).end(`Couldn't find event type with id '${validated.eventTypeId}'`);
                                            // validate actionTypeId
                                            } else if (has('actionTypeId')(validated) &&
                                                       validated.actionTypeId !== null &&
                                                       !any(hasId(validated.actionTypeId),
                                                            actionTypes)) {
                                              res.status(404).end(`Couldn't find action type with id '${validated.eventTypeId}'`);
                                            // validate affectedPageId
                                            } else if (has('affectedPageId')(validated) &&
                                                       validated.affectedPageId !== null &&
                                                       !any(hasId(validated.affectedPageId),
                                                            pages)) {
                                              res.status(404).end("Couldn't find page for specified affectedPageId");
                                            // validated affectedShapeIds
                                            } else if (has('affectedShapeIds')(validated) &&
                                                       !isEmpty(validated.affectedShapeIds) &&
                                                       (!allIdsInList(validated.affectedShapeIds,
                                                                      affectedShapes) ||
                                                        validated.affectedShapeIds
                                                        .includes(String(shape._id)))) {
                                              res.status(404).end(' The affectedShapeIds contain a non-existing shape, or the shape parent to this control');
                                            // validated affectedTexts
                                            } else if (has('affectedTextIds')(validated) &&
                                                       !isEmpty(validated.affectedTextIds) &&
                                                       (!allIdsInList(validated.affectedTextIds,
                                                                      affectedTexts)
                                                       )) {
                                              res.status(404).end(' The affectedTextIds contain a non-existing text');
                                            // all validation passed
                                            } else {
                                              Control.update(
                                                { _id: req.params.id },
                                                { $set: validated })
                                                .then(() => res.status(200).json({
                                                  ...validated,
                                                  _id: req.params.id,
                                                }))
                                                .catch(e => res.status(500).json(e));
                                            }
                                          })
                                          .catch(e => res.status(500).json(e));
                                      })
                                      .catch(e => res.status(500).json(e));
                                  })
                                  .catch(e => res.status(500).json(e));
                              })
                              .catch(e => res.status(500).json(e));
                          })
                          .catch(e => res.status(500).json(e));
                      }
                    })
                    .catch(e => res.status(500).json(e));
                })
                .catch(e => res.status(400).json(e));
            }
          })
          .catch(e => res.status(500).json(e));
      }
    })
    .catch(e => res.status(500).json(e));
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
