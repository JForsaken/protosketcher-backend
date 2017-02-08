export default {
  get: {
    all: {
      name: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
    one: {
      id: 'required',
      name: 'optional',
      pageTypeId: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
  },
  post: {
    add: {
      name: 'required',
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
