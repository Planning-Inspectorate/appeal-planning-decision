import { Next, Request, Response } from 'restify';
import IController from './IController';

export default class HelloController implements IController {
  public getAll(req: Request, res: Response, next: Next): void {
    const name = req.params.name ?? 'you';

    res.json(200, {
      message: `Hello ${name}`
    });

    next();
  }
}
