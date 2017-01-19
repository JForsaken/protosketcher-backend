import express from 'express';
import dotEnv from 'dotenv';

import routes from './config/routes';
import config from './config/server';
import apidocs from './config/apidocs';

dotEnv.config();
const app = express();

config(app);
routes(app);
apidocs(app);
