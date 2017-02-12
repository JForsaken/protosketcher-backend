export default {
  get: {
    all: {
      name: 'optional',
      pageTypeId: 'optional',
      attributes: 'optional',
      limit: 'optional',
      populate: 'optional',
    },
    one: {
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
      pageTypeId: 'required',
    },
  },
  patch: {
    one: {
      name: 'optional',
      pageTypeId: 'optional',
    },
  },
};
