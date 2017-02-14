import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Admission = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    index: { unique: true },
    ref: 'User',
  },
  token: String,
});

export default mongoose.model('Admission', Admission);
