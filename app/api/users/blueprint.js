export default {
  get: {
    all: {
      firstname: 'optional',
      lastname: 'optional',
      username: 'optional',
      password: 'optional',
      age: 'optional',
      attributes: 'optional',
      limit: 'optional',
    },
    one: {
      id: 'required',
      firstname: 'optional',
      lastname: 'optional',
      username: 'optional',
      password: 'optional',
      age: 'optional',
      attributes: 'optional',
      limit: 'optional',
    },
  },
  post: {
    add: {
      firstname: 'required',
      lastname: 'required',
      username: 'required',
      password: 'required',
      age: 'required',
    },
    authenticate: {
      username: 'required',
      password: 'required',
    },
  },
  patch: {
    one: {
      firstname: 'optional',
      lastname: 'optional',
      username: 'optional',
      password: 'optional',
      age: 'optional',
    },
  },
  delete: {
    one: {
      id: 'required',
    },
  },
};
