import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ActionType = mongoose.model('ActionType', new Schema({
  type: {
    type: String,
    index: { unique: true },
  },
}));

// Default rows in the ActionType table
const show = new ActionType({ type: 'show' });
const hide = new ActionType({ type: 'hide' });
const changePage = new ActionType({ type: 'changePage' });

show.save();
hide.save();
changePage.save();

export default ActionType;
