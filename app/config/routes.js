import express from 'express';

import * as users from '../api/users/endpoints';
import * as prototypes from '../api/prototypes/endpoints';
import * as pages from '../api/pages/endpoints';
import * as pageTypes from '../api/pagetypes/endpoints';
import * as shapes from '../api/shapes/endpoints';
import * as shapeTypes from '../api/shapetypes/endpoints';
import * as controls from '../api/controls/endpoints';
import * as eventTypes from '../api/eventtypes/endpoints';
import * as actionTypes from '../api/actiontypes/endpoints';

import { requiresToken } from '../api/middlewares';

const apiUrl = '/api/v1/';

export default (app) => {
  /* -- API endpoints -- */

  // ~ User ~
  app.post(`${apiUrl}users`, users.add);
  app.post(`${apiUrl}authenticate`, users.authenticate);
  // secure
  app.get(`${apiUrl}users`, requiresToken, users.findAll);
  app.get(`${apiUrl}users/me`, requiresToken, users.findMe);
  app.get(`${apiUrl}users/:id`, requiresToken, users.findOne);
  app.patch(`${apiUrl}users/:id`, requiresToken, users.update);
  app.delete(`${apiUrl}users/:id`, requiresToken, users.remove);

  // ~ Prototype ~
  // secure
  app.post(`${apiUrl}prototypes`, requiresToken, prototypes.add);
  app.get(`${apiUrl}prototypes`, requiresToken, prototypes.findAll);
  app.get(`${apiUrl}prototypes/:id`, requiresToken, prototypes.findOne);
  app.patch(`${apiUrl}prototypes/:id`, requiresToken, prototypes.update);
  app.delete(`${apiUrl}prototypes/:id`, requiresToken, prototypes.remove);

  // ~ Page ~
  // secure
  app.post(`${apiUrl}prototypes/:prototypeId/pages`, requiresToken, pages.add);
  app.get(`${apiUrl}prototypes/:prototypeId/pages`, requiresToken, pages.findAll);
  app.get(`${apiUrl}prototypes/:prototypeId/pages/:id`, requiresToken, pages.findOne);
  app.patch(`${apiUrl}prototypes/:prototypeId/pages/:id`, requiresToken, pages.update);
  app.delete(`${apiUrl}prototypes/:prototypeId/pages/:id`, requiresToken, pages.remove);

  // ~ PageType ~
  // secure
  app.get(`${apiUrl}pagetypes`, requiresToken, pageTypes.findAll);

  // ~ Shape ~
  // secure
  app.post(`${apiUrl}prototypes/:prototypeId/pages/:pageId/shapes`, requiresToken, shapes.add);
  app.get(`${apiUrl}prototypes/:prototypeId/pages/:pageId/shapes`, requiresToken, shapes.findAll);
  app.get(`${apiUrl}prototypes/:prototypeId/pages/:pageId/shapes/:id`, requiresToken, shapes.findOne);
  app.patch(`${apiUrl}prototypes/:prototypeId/pages/:pageId/shapes/:id`, requiresToken, shapes.update);
  app.delete(`${apiUrl}prototypes/:prototypeId/pages/:pageId/shapes/:id`, requiresToken, shapes.remove);

  // ~ ShapeType ~
  // secure
  app.get(`${apiUrl}shapetypes`, requiresToken, shapeTypes.findAll);

  // ~ Control ~
  // secure
  app.post(`${apiUrl}prototypes/:prototypeId/shapes/:shapeId/controls`, requiresToken, controls.add);
  app.get(`${apiUrl}prototypes/:prototypeId/shapes/:shapeId/controls`, requiresToken, controls.findAll);
  app.get(`${apiUrl}prototypes/:prototypeId/shapes/:shapeId/controls/:id`, requiresToken, controls.findOne);
  app.patch(`${apiUrl}prototypes/:prototypeId/shapes/:shapeId/controls/:id`, requiresToken, controls.update);
  app.delete(`${apiUrl}prototypes/:prototypeId/shapes/:shapeId/controls/:id`, requiresToken, controls.remove);

  // ~ EventType ~
  // secure
  app.get(`${apiUrl}eventtypes`, requiresToken, eventTypes.findAll);

  // ~ ActionType ~
  // secure
  app.get(`${apiUrl}actiontypes`, requiresToken, actionTypes.findAll);


  /* -- Web endpoints -- */
  app.use('/', express.static('public'));
};
