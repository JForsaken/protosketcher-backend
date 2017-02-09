import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const EventType = mongoose.model('EventType', new Schema({
  type: {
    type: String,
    index: { unique: true },
  },
}));

// Default rows in the EventType table
const click = new EventType({ type: 'click' });

click.save();

export default EventType;
