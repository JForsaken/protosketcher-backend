export default {
  get: {
    all: {
      eventTypeId: 'optional',
      actionTypeId: 'optional',
      affectedShapes: 'optional',
      // affectedTexts: 'optional',
      affectedPage: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
    one: {
      eventTypeId: 'optional',
      actionTypeId: 'optional',
      affectedShapes: 'optional',
      // affectedTexts: 'optional',
      affectedPage: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
  },
  post: {
    add: {
      eventTypeId: 'required',
      actionTypeId: 'required',
      affectedShapes: 'optional',
      // affectedTexts: 'optional',
      affectedPage: 'optional',
    },
  },
  patch: {
    one: {
      eventTypeId: 'optional',
      actionTypeId: 'optional',
      affectedShapes: 'optional',
      // affectedTexts: 'optional',
      affectedPage: 'optional',
    },
  },
};
