import { Server as RestifyServer } from 'restify';
import * as restify from 'restify';
import HelloController from './controllers/HelloController';
import IController from './controllers/IController';
import Settings from './config/Settings';

class Server {
  private server: RestifyServer;
  private helloController: IController;
  
  public constructor() {
    this.server = restify.createServer();

    this.helloController = new HelloController();
  }

  public mapRoutes() {
    this.server.get('/hello/:name', this.helloController.getAll);
  }

  public listen() {
    const port = Settings.PORT;
    const name = Settings.NAME;
    
    this.server.listen(port, () => {
      console.log('%s listening on port %s', `${name}`, `${port}`);
    });
  }
}

const server = new Server();

server.mapRoutes();
server.listen();
