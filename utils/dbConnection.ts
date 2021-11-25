import mongoose from 'mongoose';
import config from 'config';
import log from '../logger/logger';

function connect() {
  const dbUri = config.get<string>('dbUri');

  return mongoose.connect(dbUri)
    .then(() => {
      log.info('Successfully connected to DB');
    })
    .catch((error) => {
      log.error(`Error connecting to DB: ${error}`);
      process.exit(1);
    });
}

export default connect;
