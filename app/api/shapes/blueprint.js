export default {
  get: {
    all: {
      shapeTypeId: 'optional',
      parentId: 'optional',
      path: 'optional',
      color: 'optional',
      x: 'optional',
      y: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
    one: {
      shapeTypeId: 'optional',
      parentId: 'optional',
      path: 'optional',
      color: 'optional',
      x: 'optional',
      y: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
  },
  post: {
    add: {
      shapeTypeId: 'required',
      parentId: 'optional',
      path: 'required',
      color: 'required',
      x: 'required',
      y: 'required',
      uuid: 'required',
    },
  },
  patch: {
    one: {
      shapeTypeId: 'optional',
      parentId: 'optional',
      path: 'optional',
      color: 'optional',
      x: 'optional',
      y: 'optional',
    },
  },
};