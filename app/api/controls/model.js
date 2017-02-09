import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Control = new Schema({
  shapeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shape',
  },
  eventTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EventType',
  },
  actionTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActionType',
  },
  affectedShapes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shape',
  }],
  /*
  affectedTexts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Text',
  }],
  */
  affectedPage: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'Page',
  },
});

export default mongoose.model('Control', Control);
