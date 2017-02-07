import express from 'express';

import * as users from '../api/users/endpoints';
import * as prototypes from '../api/prototypes/endpoints';
import * as pages from '../api/pages/endpoints';

import { requiresToken } from '../api/middlewares';

const apiUrl = '/api/v1/';

export default (app) => {
  /* -- API endpoints -- */

  // ~ Users ~
  app.post(`${apiUrl}users`, users.add);
  app.post(`${apiUrl}authenticate`, users.authenticate);
  // secure
  app.get(`${apiUrl}users`, requiresToken, users.findAll);
  app.get(`${apiUrl}users/me`, requiresToken, users.findMe);
  app.get(`${apiUrl}users/:id`, requiresToken, users.findOne);
  app.patch(`${apiUrl}users/:id`, requiresToken, users.update);
  app.delete(`${apiUrl}users/:id`, requiresToken, users.remove);

  // ~ Prototypes ~
  // secure
  app.post(`${apiUrl}prototypes`, requiresToken, prototypes.add);
  app.get(`${apiUrl}prototypes`, requiresToken, prototypes.findAll);
  app.get(`${apiUrl}prototypes/:id`, requiresToken, prototypes.findOne);
  app.patch(`${apiUrl}prototypes/:id`, requiresToken, prototypes.update);
  app.delete(`${apiUrl}prototypes/:id`, requiresToken, prototypes.remove);

  // ~ Pages ~
  // secure
  app.post(`${apiUrl}prototypes/:prototypeId/pages`, requiresToken, pages.add);
  app.get(`${apiUrl}prototypes/:prototypeId/pages`, requiresToken, pages.findAll);
  app.get(`${apiUrl}prototypes/:prototypeId/pages/:id`, requiresToken, pages.findOne);
  app.patch(`${apiUrl}prototypes/:prototypeId/pages/:id`, requiresToken, pages.update);
  app.delete(`${apiUrl}prototypes/:prototypeId/pages/:id`, requiresToken, pages.remove);

  /* -- Web endpoints -- */
  app.use('/', express.static('public'));
};
