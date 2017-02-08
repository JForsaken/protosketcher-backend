import mongoose from 'mongoose';

import Shape from '../shapes/model';

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
});

export default mongoose.model('Page', Page);
