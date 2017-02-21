const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../apidocs/swagger.json');

export default (app) => {
  // specify host and scheme to swagger depending on the environment
  if (process.env.NODE_ENV === 'prod') {
    swaggerDocument.host = process.env.API_URI_PROD;
    swaggerDocument.schemes = ['https'];
  } else {
    swaggerDocument.host = process.env.API_URI_DEV;
  }

  // Load the swagger ui
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
