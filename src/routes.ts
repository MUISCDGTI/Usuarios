import { Express, Request, Response } from 'express';
import log from '../logger/logger';
import { createUserHandler } from './businessLogic/user/user.controller';
import { createUserSchema } from './businessLogic/user/user.schema';
import validate from './middleware/validateResource';

function routes(app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => {
    log.info(req);
    return res.sendStatus(200);
  });

  app.post('/api/users', validate(createUserSchema), createUserHandler);
}

export default routes;
