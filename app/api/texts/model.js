import mongoose from 'mongoose';

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
});

export default mongoose.model('Text', Text);
