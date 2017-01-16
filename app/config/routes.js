import express from 'express';

import * as users from '../api/users/endpoints';
import { requiresToken } from '../api/middlewares';

const apiUrl = '/api/v1/';

export default (app) => {
  /* -- API endpoints -- */

  // ~ Users ~
  app.post(`${apiUrl}users`, users.add);
  app.post(`${apiUrl}authenticate`, users.authenticate);
  // secure
  app.get(`${apiUrl}users`, requiresToken, users.findAll);
  app.get(`${apiUrl}users/:id`, requiresToken, users.findOne);
  app.patch(`${apiUrl}users/:id`, requiresToken, users.update);
  app.delete(`${apiUrl}users/:id`, requiresToken, users.remove);


  /* -- Web endpoints -- */
  app.use('/', express.static('public'));
};
