import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export default mongoose.model('Prototype', new Schema({
  name: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}));
