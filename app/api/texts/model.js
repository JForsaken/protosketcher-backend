import mongoose from 'mongoose';

import Control from '../controls/model';

const Schema = mongoose.Schema;

const Text = new Schema({
  pageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
  },
  fontSize: Number,
  content: String,
  x: Number,
  y: Number,
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'Shape',
  },
  visible: {
    type: Boolean,
    default: true,
  },
});

Text.post('remove', (doc) => {
  Control.find({ affectedTextIds: doc._id })
    .then((controls) => {
      // filter out the deleted text of the affectedTextIds
      controls.forEach((o) => {
        const control = o;
        control.affectedTextIds = control.affectedTextIds
          .filter(a => String(a) !== String(doc._id));

        control.save();
      });
    });
});

export default mongoose.model('Text', Text);
