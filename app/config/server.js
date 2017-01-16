import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

export default (app) => {
  // enable cross origin requests
  app.use(cors());

  // use morgan to log requests to the console
  app.use(morgan('dev'));

  // limit JSON bodies to 50mb
  app.use(bodyParser.json({
    limit: '50mb',
  }));

  // limit url parameters to 50mb
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
  }));

  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.MONGODB_URI);

  // set the listening port to 5000
  app.set('port', (process.env.PORT || 5000));

  app.listen(app.get('port'), () => {
    console.log('==> 🌎  Node app is listening on port', app.get('port')); // eslint-disable-line no-console
  });

  /* Allow CORS */
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
};
