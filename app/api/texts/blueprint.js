export default {
  get: {
    all: {
      fontSize: 'optional',
      content: 'optional',
      x: 'optional',
      y: 'optional',
      parentId: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
    one: {
      fontSize: 'optional',
      content: 'optional',
      x: 'optional',
      y: 'optional',
      parentId: 'optional',
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
      parentId: 'optional',
      uuid: 'required',
    },
  },
  patch: {
    one: {
      fontSize: 'optional',
      content: 'optional',
      x: 'optional',
      y: 'optional',
      parentId: 'optional',
    },
  },
};
