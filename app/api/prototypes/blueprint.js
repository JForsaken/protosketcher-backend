export default {
  get: {
    all: {
      name: 'optional',
      isMobile: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
    one: {
      id: 'required',
      name: 'optional',
      isMobile: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
  },
  post: {
    add: {
      name: 'required',
      isMobile: 'required',
    },
  },
  patch: {
    one: {
      name: 'optional',
      isMobile: 'optional',
    },
  },
  delete: {
    one: {
      id: 'required',
    },
  },
};
