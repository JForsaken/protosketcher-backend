import mongoose from 'mongoose';

import Prototype from '../prototypes/model';

const Schema = mongoose.Schema;

const User = new Schema({
  email: {
    type: String,
    index: { unique: true },
  },
  password: String,
});

User.post('remove', (doc) => {
  Prototype.remove({ user: doc._id }).exec();
});

export default mongoose.model('User', User);
