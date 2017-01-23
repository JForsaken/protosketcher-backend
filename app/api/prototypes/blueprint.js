export default {
  get: {
    all: {
      name: 'optional',
      user: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
    one: {
      id: 'required',
      name: 'optional',
      user: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
  },
  post: {
    add: {
      name: 'required',
      user: 'required',
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
