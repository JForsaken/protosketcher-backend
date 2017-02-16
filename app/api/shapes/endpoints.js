import { omit, has } from 'ramda';

import blueprint from './blueprint';
import { validator, queryBuilder } from '../helpers';
import Shape from './model';
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
                res.status(200).json(shapes);
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
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to create shape for page with '${prototype.userId}' as owner`);
      } else {
        validator(req.body, blueprint.post.add)
          .then((validated) => {
            Page.find({ _id: req.params.pageId })
              .then((page) => {
                if (!page) {
                  res.status(404).end(`Couldn't find page with id '${req.params.pageId}'`);
                } else {
                  ShapeType.findOne({ _id: validated.shapeTypeId })
                    .then((shapeType) => {
                      if (!shapeType) {
                        res.status(404).end(`Couldn't find shape type with id '${validated.shapeTypeId}'`);
                      } else {
                        const saveShape = () => {
                          const shape = new Shape({ pageId: req.params.pageId, ...omit(['uuid'], validated) });

                          shape.save((err, doc) => {
                            if (err) {
                              res.status(500).json(err);
                            } else {
                              res.status(200).json({ uuid: validated.uuid, ...doc._doc });
                            }
                          });
                        };

                        if (has('parentId')(validated) && validated.parentId !== null) {
                          Shape.findOne({ _id: validated.parentId })
                            .then((parentShape) => {
                              if (!parentShape) {
                                res.status(404).end(`Couldn't find parent shape type with id '${validated.parentId}'`);
                              } else if (has('parentId')(validated)) {
                                if (shapeType.type !== 'squiggly') {
                                  res.status(400).end("Only 'squiggly' types of shapes can have a parent shape");
                                } else {
                                  saveShape();
                                }
                              } else {
                                saveShape();
                              }
                            })
                            .catch(e => res.status(500).json(e));
                        } else {
                          saveShape();
                        }
                      }
                    })
                    .catch(e => res.status(500).json(e));
                }
              })
              .catch(e => res.status(400).json(e));
          })
          .catch(e => res.status(500).json(e));
      }
    })
    .catch(e => res.status(500).json(e));
};

/**
 * Update one shape by id
 */
export const update = (req, res) => {
  Prototype.findOne({ _id: req.params.prototypeId })
    .then((prototype) => {
      if (!prototype) {
        res.status(404).end(`Couldn't find prototype with id '${req.params.prototypeId}'`);
      } else if (req.decodedToken._id !== String(prototype.userId)) {
        res.status(403).end(`User with id '${req.decodedToken._id}' attempted to update shape for page with '${prototype.userId}' as owner`);
      } else {
        Shape.findOne({ _id: req.params.id, pageId: req.params.pageId })
          .then((shape) => {
            if (!shape) {
              res.status(404).end(`Couldn't find shape with id '${req.params.id}'`);
            } else {
              validator(req.body, blueprint.patch.one)
                .then((validated) => {
                  const updateShape = () => {
                    Shape.update({ _id: req.params.id }, { $set: validated })
                      .then(() => res.status(200).json({ ...validated, _id: req.params.id }))
                      .catch(e => res.status(500).json(e));
                  };

                  if (has('shapeTypeId')(validated) && has('parentId')(validated)) {
                    ShapeType.findOne({ _id: validated.shapeTypeId })
                      .then((shapeType) => {
                        if (!shapeType) {
                          res.status(404).end(`Couldn't find shape type with id '${validated.shapeTypeId}'`);
                        } else {
                          Shape.findOne({ _id: validated.parentId })
                            .then((parentShape) => {
                              if (!parentShape) {
                                res.status(404).end(`Couldn't find parent shape type with id '${validated.parentId}'`);
                              } else if (has('parentId')(validated) && validated.parentId !== null) {
                                if (shapeType.type !== 'squiggly') {
                                  res.status(400).end("Only 'squiggly' types of shapes can have a parent shape");
                                } else {
                                  updateShape();
                                }
                              } else {
                                updateShape();
                              }
                            })
                            .catch(e => res.status(500).json(e));
                        }
                      })
                      .catch(e => res.status(500).json(e));
                  } else if (has('shapeTypeId')(validated)) {
                    ShapeType.findOne({ _id: validated.shapeTypeId })
                      .then((shapeType) => {
                        if (!shapeType) {
                          res.status(404).end(`Couldn't find shape type with id '${validated.shapeTypeId}'`);
                        } else if (shapeType.type === 'squiggly' && shape.parentId !== null) {
                          res.status(400).end("Only 'squiggly' types of shapes can have a parent shape");
                        } else {
                          updateShape();
                        }
                      })
                      .catch(e => res.status(500).json(e));
                  } else if (has('parentId')(validated)) {
                    if (validated.parentId !== null) {
                      Shape.findOne({ _id: validated.parentId })
                        .then((parentShape) => {
                          if (!parentShape) {
                            res.status(404).end(`Couldn't find parent shape type with id '${validated.parentId}'`);
                          } else {
                            ShapeType.findOne({ _id: shape.shapeTypeId })
                              .then((shapeType) => {
                                if (!shapeType) {
                                  res.status(404).end(`Couldn't find shape type with id '${validated.shapeTypeId}'`);
                                } else if (shapeType.type === 'squiggly') {
                                  res.status(400).end("Only 'squiggly' types of shapes can have a parent shape");
                                } else {
                                  updateShape();
                                }
                              })
                              .catch(e => res.status(500).json(e));
                          }
                        })
                        .catch(e => res.status(500).json(e));
                    }
                  } else {
                    updateShape();
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
