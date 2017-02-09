export default {
  get: {
    all: {
      fontSize: 'optional',
      content: 'optional',
      x: 'optional',
      y: 'optional',
      shapeId: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
    one: {
      fontSize: 'optional',
      content: 'optional',
      x: 'optional',
      y: 'optional',
      shapeId: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
  },
  post: {
    add: {
      fontSize: 'required',
      content: 'required',
      x: 'required',
      y: 'required',
      shapeId: 'optional',
    },
  },
  patch: {
    one: {
      fontSize: 'optional',
      content: 'optional',
      x: 'optional',
      y: 'optional',
      shapeId: 'optional',
    },
  },
};
