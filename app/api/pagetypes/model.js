import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PageType = mongoose.model('PageType', new Schema({
  type: {
    type: String,
    index: { unique: true },
  },
}));

// Default rows in the PageType table
const page = new PageType({ type: 'page' });
const modal = new PageType({ type: 'modal' });

page.save();
modal.save();

export default PageType;
