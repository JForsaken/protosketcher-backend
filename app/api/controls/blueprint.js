export default {
  get: {
    all: {
      eventTypeId: 'optional',
      actionTypeId: 'optional',
      affectedShapes: 'optional',
      // affectedText: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
    one: {
      eventTypeId: 'optional',
      actionTypeId: 'optional',
      affectedShapes: 'optional',
      // affectedText: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
  },
  post: {
    add: {
      eventTypeId: 'required',
      actionTypeId: 'required',
      affectedShapes: 'required',
      // affectedText: 'optional',
    },
  },
  patch: {
    one: {
      eventTypeId: 'required',
      actionTypeId: 'required',
      affectedShapes: 'required',
      // affectedText: 'optional',
    },
  },
};
