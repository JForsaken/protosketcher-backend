import { isEmpty, omit } from 'ramda';

import blueprint from './blueprint';
import { validator, queryBuilder } from '../helpers';
import Shape from './model';
import Control from '../controls/model';
import Page from '../pages/model';
import ShapeType from '../shapetypes/model';
import Prototype from '../prototypes/model';

/**
 * List all shapes
 */
export const findAll = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to get shapes for page with '${prototype.userId}' as owner`);
      } else {
        validator(req.query, blueprint.get.all)
          .then((validated) => {
            const { where, limit, projection, populate } = queryBuilder(validated);

            Shape.find({ ...where, pageId: req.params.pageId })
              .limit(limit)
              .populate(populate)
              .select(projection)
              .then((shapes) => {
                if (isEmpty(shapes)) {
                  res.status(200).json(shapes);
                } else {
                  const shapeIds = shapes.map(o => o._id);

                  // find all controls for the found shapes
                  Control.find({ shapeId: { $in: shapeIds } })
                    .then((controls) => {
                      // associate each controls to their parent shape
                      shapes.forEach((s) => {
                        const curShape = s._doc;
                        curShape.controls = controls
                          .filter(c => String(s._id) === String(c.shapeId));
                      });

                      res.status(200).json(shapes);
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
};

/**
 * List one shape by id
 */
export const findOne = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to get shape for page with '${prototype.userId}' as owner`);
      } else {
        validator(req.query, blueprint.get.one)
          .then((validated) => {
            const { projection, populate } = queryBuilder(validated);

            Shape.findOne({ _id: req.params.id, pageId: req.params.pageId })
              .populate(populate)
              .select(projection)
              .then((shape) => {
                if (!shape) {
                  res.status(404).end(`Couldn't find shape with id '${req.params.id}'`);
                } else {
                  res.status(200).json(shape);
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
 * Add new shape
 */
export const add = (req, res) => {
  validator(req.body, blueprint.post.add)
    .then((validated) => {
      Promise.all([
        Prototype.findOne({ _id: req.params.prototypeId }),
        Page.find({ _id: req.params.pageId }),
        Shape.findOne({ _id: validated.parentId }),
        ShapeType.findOne({ _id: validated.shapeTypeId }),
      ])
        .then((info) => {
          const prototype = info[0];
          const page = info[1];
          const parentShape = info[2];
          const shapeType = info[3];

          // validate prototype
          if (!prototype) {
            res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
          // validate proper user
          } else if (req.decodedToken._id !== String(prototype.userId)) {
            res.status(403).end(`User with id '${req.decodedToken._id}' attempted to create shape for page with '${prototype.userId}' as owner`);
          // validate page
          } else if (!page) {
            res.status(404).end(`Couldn't find page with id '${req.params.pageId}'`);
          // validate parentId
          } else if (validated.parentId && !parentShape) {
            res.status(404).end(`Couldn't find parent shape with id '${validated.parentId}'`);
          // validate shapeTypeId
          } else if (!shapeType) {
            res.status(404).end(`Couldn't find shape type with id '${validated.shapeTypeId}'`);
          // validate parentId
          } else if (validated.parentId &&
                     shapeType.type !== 'squiggly') {
            res.status(400).end("Only the shapes with 'squiggly' as their shape type can have a parent shape");
          // passed all validation
          } else {
            const shape = new Shape({ pageId: req.params.pageId, ...omit(['uuid'], validated) });

            shape.save((err, doc) => {
              if (err) {
                res.status(500).json(err);
              } else {
                res.status(200).json({ uuid: validated.uuid, ...doc._doc });
              }
            });
          }
        })
        .catch(e => res.status(500).json(e));
    })
    .catch(e => res.status(400).json(e));
};

/**
 * Update one shape by id
 */
export const update = (req, res) => {
  validator(req.body, blueprint.patch.one)
    .then((validated) => {
      Promise.all([
        Prototype.findOne({ _id: req.params.prototypeId }),
        Shape.findOne({ _id: req.params.id }),
        Shape.findOne({ _id: validated.parentId }),
        ShapeType.findOne({ _id: validated.shapeTypeId }),
        ShapeType.findOne({ type: 'squiggly' }),
      ])
        .then((info) => {
          const prototype = info[0];
          const shape = info[1];
          const parentShape = info[2];
          const shapeType = info[3];
          const squigglyShapeType = info[4];

          // validate prototype
          if (!prototype) {
            res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
          // validate proper user
          } else if (req.decodedToken._id !== String(prototype.userId)) {
            res.status(403).end(`User with id '${req.decodedToken._id}' attempted to create shape for page with '${prototype.userId}' as owner`);
          // validate shape
          } else if (!shape) {
            res.status(404).end(`Couldn't find shape with id '${req.params.id}'`);
          // validate parentId
          } else if (validated.parentId && !parentShape) {
            res.status(404).end(`Couldn't find parent shape with id '${validated.parentId}'`);
          // validate shapeTypeId
          } else if (validated.shapeTypeId && !shapeType) {
            res.status(404).end(`Couldn't find shape type with id '${validated.shapeTypeId}'`);
          // validate parentId
          } else if (validated.parentId &&
                     validated.parentId === req.params.id) {
            res.status(400).end('Shape cannot be its own parent shape');
          // validate parentId with shape type collision
          } else if ((!validated.shapeTypeId &&
                      (shape.parentId || validated.parentId) &&
                      shape.shapeTypeId !== String(squigglyShapeType._id)) ||
                     (validated.shapeTypeId &&
                      (validated.parentId || shape.parentId) &&
                      shapeType.type !== 'squiggly')) {
            res.status(400).end("Only the shapes with 'squiggly' as their shape type can have a parent shape");
          // passed all validation
          } else {
            Shape.update({ _id: req.params.id }, { $set: validated })
              .then(() => res.status(200).json({ ...validated, _id: req.params.id }))
              .catch(e => res.status(500).json(e));
          }
        })
        .catch(e => res.status(500).json(e));
    })
    .catch(e => res.status(400).json(e));
};

/**
 * Remove one shape by id
 */
export const remove = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to delete shape for page with '${prototype.userId}' as owner`);
      } else {
        Shape.findOne({ _id: req.params.id, pageId: req.params.pageId })
          .then((shape) => {
            if (!shape) {
              res.status(404).end(`Couldn't find shape with id '${req.params.id}'`);
            } else {
              shape.remove()
                .then(() => {
                  res.status(200).json(shape);
                })
                .catch(e => res.status(500).json(e));
            }
          })
          .catch(e => res.status(500).json(e));
      }
    })
    .catch(e => res.status(500).json(e));
};
