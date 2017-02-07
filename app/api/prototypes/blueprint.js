export default {
  get: {
    all: {
      name: 'optional',
      isMobile: 'optional',
      userId: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
    one: {
      id: 'required',
      name: 'optional',
      isMobile: 'optional',
      userId: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
  },
  post: {
    add: {
      name: 'required',
      isMobile: 'required',
      userId: 'required',
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
