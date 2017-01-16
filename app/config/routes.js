import express from 'express';

export default (app) => {
  /* -- API endpoints -- */
  // insert here

  /* -- Web endpoints -- */
  app.use('/', express.static('public'));
};
