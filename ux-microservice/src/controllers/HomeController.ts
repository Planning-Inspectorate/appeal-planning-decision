import express, { Request, Response } from 'express';
import IControllerBase from 'src/interfaces/IControllerBase';

class HomeController implements IControllerBase {
  public path = '/';

  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get('/', this.index);
  }

  index = (req: Request, res: Response) => {
    res.render('index');
  };
}

export default HomeController;
