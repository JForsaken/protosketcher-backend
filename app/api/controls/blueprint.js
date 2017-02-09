export default {
  get: {
    all: {
      eventTypeId: 'optional',
      actionTypeId: 'optional',
      affectedShapeIds: 'optional',
      affectedTextIds: 'optional',
      affectedPageId: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
    one: {
      eventTypeId: 'optional',
      actionTypeId: 'optional',
      affectedShapeIds: 'optional',
      affectedTextIds: 'optional',
      affectedPageId: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
  },
  post: {
    add: {
      eventTypeId: 'required',
      actionTypeId: 'required',
      affectedShapeIds: 'optional',
      affectedTextIds: 'optional',
      affectedPageId: 'optional',
    },
  },
  patch: {
    one: {
      eventTypeId: 'optional',
      actionTypeId: 'optional',
      affectedShapeIds: 'optional',
      affectedTextIds: 'optional',
      affectedPageId: 'optional',
    },
  },
};
