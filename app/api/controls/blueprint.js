export default {
  get: {
    all: {
      eventTypeId: 'optional',
      actionTypeId: 'optional',
      affectedShapes: 'optional',
      // affectedTexts: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
    one: {
      eventTypeId: 'optional',
      actionTypeId: 'optional',
      affectedShapes: 'optional',
      // affectedTexts: 'optional',
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
      // affectedTexts: 'required',
    },
  },
  patch: {
    one: {
      eventTypeId: 'required',
      actionTypeId: 'required',
      affectedShapes: 'required',
      // affectedTexts: 'optional',
    },
  },
};
