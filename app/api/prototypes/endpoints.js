import blueprint from './blueprint';
import { validator, queryBuilder } from '../helpers';
import Prototype from './model';
import Page from '../pages/model';
import PageType from '../pagetypes/model';

/**
 * List all prototypes
 */
export const findAll = (req, res) => {
  validator(req.query, blueprint.get.all)
    .then((validated) => {
      const { where, limit, projection, populate } = queryBuilder(validated);

      Prototype.find({ ...where, userId: req.decodedToken._id })
        .limit(limit)
        .populate(populate)
        .select(projection)
        .then((prototypes) => {
          res.status(200).json(prototypes);
        })
        .catch(e => res.status(500).json(e));
    })
    .catch(e => res.status(400).json(e));
};

/**
 * List one prototype by id
 */
export const findOne = (req, res) => {
  validator(req.query, blueprint.get.one)
    .then((validated) => {
      const { projection, populate } = queryBuilder(validated);

      Prototype.findOne({ _id: req.params.id, userId: req.decodedToken._id })
        .populate(populate)
        .select(projection)
        .then((prototype) => {
          if (!prototype) {
            res.status(404).end(`Couldn't find prototype with id ${req.params.id}`);
          } else {
            res.status(200).json(prototype);
          }
        })
        .catch(e => res.status(500).json(e));
    })
    .catch(e => res.status(400).json(e));
};

/**
 * Add new prototype
 */
export const add = (req, res) => {
  validator(req.body, blueprint.post.add)
    .then((validated) => {
      const prototype = new Prototype({ userId: req.decodedToken._id, ...validated });

      prototype.save((err, savedPrototype) => {
        if (err) {
          res.status(500).json(err);
        } else {
          PageType.findOne({ type: 'page' })
            .then((pageType) => {
              const page = new Page({
                name: 'Page 1',
                prototypeId: savedPrototype._id,
                pageTypeId: pageType._id,
              });
              page.save((saveErr) => {
                if (saveErr) {
                  res.status(500).json(err);
                } else {
                  res.status(200).json(savedPrototype);
                }
              })
                .catch(e => res.status(500).json(e));
            })
            .catch(e => res.status(500).json(e));
        }
      });
    })
    .catch(e => res.status(400).json(e));
};

/**
 * Update one prototype by id
 */
export const update = (req, res) => {
  Prototype.findOne({ _id: req.params.id })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id ${req.params.id}`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to update prototype with '${prototype.userId}' as owner`);
      } else {
        validator(req.body, blueprint.patch.one)
          .then((validated) => {
            Prototype.update({ _id: req.params.id }, { $set: validated })
              .then(() => res.status(200).json({ ...validated, _id: req.params.id }))
              .catch(e => res.status(500).json(e));
          })
          .catch(e => res.status(400).json(e));
      }
    })
    .catch(e => res.status(500).json(e));
};

/**
 * Remove one prototype by id
 */
export const remove = (req, res) => {
  Prototype.findOne({ _id: req.params.id })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id ${req.params.id}`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to remove prototype with '${prototype.userId}' as owner`);
      } else {
        prototype.remove()
          .then(() => {
            res.status(200).json(prototype);
          })
          .catch(e => res.status(500).json(e));
      }
    })
    .catch(e => res.status(500).json(e));
};
