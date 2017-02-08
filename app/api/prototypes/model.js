import mongoose from 'mongoose';

import Page from '../pages/model';

const Schema = mongoose.Schema;

const Prototype = new Schema({
  name: String,
  isMobile: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

Prototype.post('remove', (doc) => {
  Page.remove({ prototypeId: doc._id }).exec();
});

export default mongoose.model('Prototype', Prototype);
