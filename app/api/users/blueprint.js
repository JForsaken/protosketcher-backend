export default {
  get: {
    all: {
      email: 'optional',
      password: 'optional',
      attributes: 'optional',
      limit: 'optional',
    },
    me: {
      attributes: 'optional',
    },
    one: {
      email: 'optional',
      password: 'optional',
      attributes: 'optional',
      limit: 'optional',
    },
  },
  post: {
    add: {
      email: 'required',
      password: 'required',
    },
    authenticate: {
      email: 'required',
      password: 'required',
    },
  },
  patch: {
    one: {
      email: 'optional',
      password: 'optional',
    },
  },
};
