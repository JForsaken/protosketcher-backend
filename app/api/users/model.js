import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export default mongoose.model('User', new Schema({
  email: {
    type: String,
    index: { unique: true },
  },
  password: String,
}));
