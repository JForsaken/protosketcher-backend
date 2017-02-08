import mongoose from 'mongoose';

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

export default mongoose.model('Page', Page);
