import express from 'express';
import config from 'config';
import connect from '../utils/dbConnection';
import log from '../logger/logger';
import routes from './routes';

const host = config.get<string>('host');
const port = config.get<number>('port');
const app = express();

app.use(express.json());

app.listen(port, () => {
  connect();
  routes(app);
  log.info(`App running at ${host}:${port}`);
});
