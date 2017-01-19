const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../apidocs/swagger.json');

export default (app) => {
  // Load the swagger ui
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
