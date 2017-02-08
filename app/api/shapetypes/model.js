import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PageType = mongoose.model('ShapeType', new Schema({
  type: {
    type: String,
    index: { unique: true },
  },
}));

// Default rows in the ShapeType table
const line = new PageType({ type: 'line' });
const textbox = new PageType({ type: 'textbox' });
const button = new PageType({ type: 'button' });
const squiggly = new PageType({ type: 'squiggly' });

line.save();
textbox.save();
button.save();
squiggly.save();

export default PageType;
