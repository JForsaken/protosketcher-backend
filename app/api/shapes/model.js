import mongoose from 'mongoose';

import Control from '../controls/model';

const Schema = mongoose.Schema;

const Shape = new Schema({
  pageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
  },
  shapeTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShapeType',
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shape',
    default: null,
  },
  path: String,
  color: String,
  x: Number,
  y: Number,
});

Shape.post('remove', (doc) => {
  const Model = mongoose.model('Shape', Shape);

  Control.remove({ shapeId: doc._id }).exec();

  // find all  the shapes having the deleted shape as parent
  Model.find({ parentId: doc._id })
    .then((shapes) => {
      // set their parentId as null since the parent is now deleted
      shapes.forEach((o) => {
        const shape = o;
        shape.parentId = null;
        shape.save();
      });
    });
});

export default mongoose.model('Shape', Shape);
