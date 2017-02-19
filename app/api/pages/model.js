import mongoose from 'mongoose';

import Shape from '../shapes/model';
import Text from '../texts/model';
import Control from '../controls/model';

const Schema = mongoose.Schema;

const Page = new Schema({
  name: String,
  prototypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prototype',
  },
  pageTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PageType',
  },
});

Page.post('remove', (doc) => {
  Shape.remove({ pageId: doc._id }).exec();
  Text.remove({ pageId: doc._id }).exec();

  Control.find({ affectedPageId: doc._id })
    .then((controls) => {
      // set the controls' affectedPageId as null since the parent is now deleted
      controls.forEach((o) => {
        const control = o;
        control.affectedPageId = null;

        control.save();
      });
    });
});

export default mongoose.model('Page', Page);
