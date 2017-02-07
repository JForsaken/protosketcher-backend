export default {
  get: {
    all: {
      name: 'optional',
      prototypeId: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
    one: {
      id: 'required',
      name: 'optional',
      prototypeId: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
  },
  post: {
    add: {
      name: 'required',
      prototypeId: 'required',
    },
  },
  patch: {
    one: {
      name: 'optional',
    },
  },
  delete: {
    one: {
      id: 'required',
    },
  },
};
