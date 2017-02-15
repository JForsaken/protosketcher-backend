import blueprint from './blueprint';
import { validator, queryBuilder } from '../helpers';
import Control from './model';
import Prototype from '../prototypes/model';

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
        validator(req.body, blueprint.post.add)
          .then((validated) => {
            const control = new Control({ shapeId: req.params.shapeId, ...validated });

            control.save((err, doc) => {
              if (err) {
                res.status(500).json(err);
              } else {
                res.status(200).json(doc);
              }
            });
          })
          .catch(e => res.status(400).json(e));
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
                  Control.update({ _id: req.params.id }, { $set: validated })
                    .then(() => res.status(200).json({ ...validated, _id: req.params.id }))
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
