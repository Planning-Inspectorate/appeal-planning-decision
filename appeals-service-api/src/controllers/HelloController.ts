import { Next, Request, Response } from 'restify';

export default class HelloController {
  public static getAll(req: Request, res: Response, next: Next): void {
    const name = req.params.name ?? 'you';

    res.json(200, {
      message: `Hello ${name}`,
    });

    next();
  }
}
