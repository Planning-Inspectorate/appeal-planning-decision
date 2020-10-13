import { Next, Request, Response } from 'restify';

export default interface IController {
  getAll(req: Request, res: Response, next: Next) : void;
}
