import { Request, Response } from "express";
import log from '../../../logger/logger';
import { CreateUserInput } from "./user.schema";
import { createUser } from "./user.service";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput['body']>, res: Response) {
  log.info(req.body);
  try {
    res.send(await createUser(req.body));
  } catch (e: any) {
    log.error(e);
    res.status(409).send(e.message);
  }
}
