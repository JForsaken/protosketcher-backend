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
  Control.remove({ shapeId: doc._id }).exec();
});

export default mongoose.model('Shape', Shape);