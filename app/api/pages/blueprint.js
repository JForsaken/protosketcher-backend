export default {
  get: {
    all: {
      name: 'optional',
      prototypeId: 'optional',
      pageTypeId: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
    one: {
      id: 'required',
      name: 'optional',
      prototypeId: 'optional',
      pageTypeId: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
  },
  post: {
    add: {
      name: 'required',
      prototypeId: 'required',
      pageTypeId: 'required',
    },
  },
  patch: {
    one: {
      name: 'optional',
      pageTypeId: 'optional',
    },
  },
  delete: {
    one: {
      id: 'required',
    },
  },
};
