import mongoose from 'mongoose';

import Control from '../controls/model';
import Text from '../texts/model';

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
  visible: {
    type: Boolean,
    default: true,
  },
});

Shape.post('remove', (doc) => {
  const Model = mongoose.model('Shape', Shape);

  Control.remove({ shapeId: doc._id }).exec();

  Promise.all([
    Model.find({ parentId: doc._id }),
    Text.find({ parentId: doc._id }),
    Control.find({ affectedShapeIds: doc._id }),
  ])
    .then((values) => {
      // the shapes having the deleted shape as parent
      const shapes = values[0];
      // the texts having the deleted shape as parent
      const texts = values[1];
      // the controls having the deleted shape as an affected shape
      const controls = values[2];

      // set the shapes' parentId as null since the parent is now deleted
      shapes.forEach((o) => {
        const shape = o;
        shape.parentId = null;

        shape.save();
      });

      // set the texts' parentId as null since the parent is now deleted
      texts.forEach((o) => {
        const text = o;
        text.parentId = null;

        text.save();
      });

      // filter out the deleted shape of the affectedShapeIds
      controls.forEach((o) => {
        const control = o;
        control.affectedShapeIds = control.affectedShapeIds
          .filter(a => String(a) !== String(doc._id));

        control.save();
      });
    });
});

export default mongoose.model('Shape', Shape);
