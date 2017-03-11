export default {
  get: {
    all: {
      fontSize: 'optional',
      content: 'optional',
      x: 'optional',
      y: 'optional',
      parentId: 'optional',
      visible: 'optional',
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
      visible: 'optional',
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
      visible: 'optional',
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
      visible: 'optional',
      parentId: 'optional',
    },
  },
};
