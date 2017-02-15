import { has } from 'ramda';

import blueprint from './blueprint';
import { validator, queryBuilder } from '../helpers';
import Page from './model';
import PageType from '../pagetypes/model';
import Prototype from '../prototypes/model';

/**
 * List all pages
 */
export const findAll = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to get pages for prototype with '${prototype.userId}' as owner`);
      } else {
        validator(req.query, blueprint.get.all)
          .then((validated) => {
            const { where, limit, projection, populate } = queryBuilder(validated);

            Page.find({ ...where, prototypeId: req.params.prototypeId })
              .limit(limit)
              .populate(populate)
              .select(projection)
              .then((pages) => {
                res.status(200).json(pages);
              })
              .catch(e => res.status(500).json(e));
          })
          .catch(e => res.status(400).json(e));
      }
    })
    .catch(e => res.status(500).json(e));
};

/**
 * List one page by id
 */
export const findOne = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to get page for prototype with '${prototype.userId}' as owner`);
      } else {
        validator(req.query, blueprint.get.one)
          .then((validated) => {
            const { projection, populate } = queryBuilder(validated);

            Page.findOne({ _id: req.params.id, prototypeId: req.params.prototypeId })
              .populate(populate)
              .select(projection)
              .then((page) => {
                if (!page) {
                  res.status(404).end(`Couldn't find page with id '${req.params.id}'`);
                } else {
                  res.status(200).json(page);
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
 * Add new page
 */
export const add = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to create page for prototype with '${prototype.userId}' as owner`);
      } else {
        validator(req.body, blueprint.post.add)
          .then((validated) => {
            PageType.findOne({ _id: validated.pageTypeId })
              .then((pageType) => {
                if (!pageType) {
                  res.status(404).end(`Couldn't find page type with id '${validated.pageTypeId}'`);
                } else {
                  const page = new Page({ prototypeId: req.params.prototypeId, ...validated });

                  page.save((err, doc) => {
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
          .catch(e => res.status(400).json(e));
      }
    })
    .catch(e => res.status(500).json(e));
};

/**
 * Update one page by id
 */
export const update = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to update page for prototype with '${prototype.userId}' as owner`);
      } else {
        Page.findOne({ _id: req.params.id, prototypeId: req.params.prototypeId })
          .then((page) => {
            if (!page) {
              res.status(404).end(`Couldn't find page with id '${req.params.id}'`);
            } else {
              validator(req.body, blueprint.patch.one)
                .then((validated) => {
                  const updatePage = () => {
                    Page.update({ _id: req.params.id }, { $set: validated })
                      .then(() => res.status(200).json({ ...validated, _id: req.params.id }))
                      .catch(e => res.status(500).json(e));
                  };

                  if (has('pageTypeId')(validated)) {
                    PageType.findOne({ _id: validated.pageTypeId })
                      .then((pageType) => {
                        if (!pageType) {
                          res.status(404).end(`Couldn't find page type with id '${validated.pageTypeId}'`);
                        } else {
                          updatePage();
                        }
                      })
                      .catch(e => res.status(500).json(e));
                  } else {
                    updatePage();
                  }
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
 * Remove one page by id
 */
export const remove = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to delete page for prototype with '${prototype.userId}' as owner`);
      } else {
        Page.findOne({ _id: req.params.id, prototypeId: req.params.prototypeId })
          .then((page) => {
            if (!page) {
              res.status(404).end(`Couldn't find page with id '${req.params.id}'`);
            } else {
              page.remove()
                .then(() => {
                  res.status(200).json(page);
                })
                .catch(e => res.status(500).json(e));
            }
          })
          .catch(e => res.status(500).json(e));
      }
    })
    .catch(e => res.status(500).json(e));
};
