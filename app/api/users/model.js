import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export default mongoose.model('User', new Schema({
  firstname: String,
  lastname: String,
  username: String,
  password: String,
  age: Number,
}));
