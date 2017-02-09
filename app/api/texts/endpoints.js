import blueprint from './blueprint';
import { validator, queryBuilder } from '../helpers';
import Text from './model';
import Prototype from '../prototypes/model';

/**
 * List all texts
 */
export const findAll = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id ${req.params.prototypeId}`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to get texts for page with '${prototype.userId}' as owner`);
      } else {
        validator(req.query, blueprint.get.all)
          .then((validated) => {
            const { where, limit, projection, populate } = queryBuilder(validated);

            Text.find({ ...where, pageId: req.params.pageId })
              .limit(limit)
              .populate(populate)
              .select(projection)
              .then((texts) => {
                res.status(200).json(texts);
              })
              .catch(e => res.status(500).json(e));
          })
          .catch(e => res.status(400).json(e));
      }
    })
    .catch(e => res.status(500).json(e));
};

/**
 * List one text by id
 */
export const findOne = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id ${req.params.prototypeId}`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to get text for page with '${prototype.userId}' as owner`);
      } else {
        validator(req.params, blueprint.get.one)
          .then((validated) => {
            const { projection, populate } = queryBuilder(validated);

            Text.findOne({ _id: req.params.id, pageId: req.params.pageId })
              .populate(populate)
              .select(projection)
              .then((text) => {
                if (!text) {
                  res.status(404).end(`Couldn't find text with id ${req.params.id}`);
                } else {
                  res.status(200).json(text);
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
 * Add new text
 */
export const add = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id ${req.params.prototypeId}`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to create text for page with '${prototype.userId}' as owner`);
      } else {
        validator({ pageId: req.params.pageId, ...req.body }, blueprint.post.add)
          .then((validated) => {
            const text = new Text({ pageId: req.params.pageId, ...validated });

            text.save((err, doc) => {
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
 * Update one text by id
 */
export const update = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id ${req.params.prototypeId}`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to update text for page with '${prototype.userId}' as owner`);
      } else {
        Text.findOne({ _id: req.params.id, pageId: req.params.pageId })
          .then((text) => {
            if (!text) {
              res.status(404).end(`Couldn't find text with id ${req.params.id}`);
            } else {
              validator(req.body, blueprint.patch.one)
                .then((validated) => {
                  Text.update({ _id: req.params.id }, { $set: validated })
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
 * Remove one text by id
 */
export const remove = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id ${req.params.prototypeId}`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to delete text for page with '${prototype.userId}' as owner`);
      } else {
        Text.findOne({ _id: req.params.id, pageId: req.params.pageId })
          .then((text) => {
            if (!text) {
              res.status(404).end(`Couldn't find text with id ${req.params.id}`);
            } else {
              text.remove()
                .then(() => {
                  res.status(200).json(text);
                })
                .catch(e => res.status(500).json(e));
            }
          })
          .catch(e => res.status(500).json(e));
      }
    })
    .catch(e => res.status(500).json(e));
};