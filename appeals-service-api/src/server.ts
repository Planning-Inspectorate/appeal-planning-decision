import { Server as RestifyServer } from 'restify';
import * as restify from 'restify';
import HelloController from './controllers/HelloController';
import Config from './config/Config';
import LoggerService from './services/Logger';

class Server {
  private logger: LoggerService;

  private server: RestifyServer;

  public constructor() {
    this.logger = new LoggerService();

    this.server = restify.createServer();
  }

  public mapRoutes() {
    this.server.get('/hello/:name', HelloController.getAll);
  }

  public listen() {
    const port = Config.PORT;
    const name = Config.NAME;

    this.server.listen(port, () => {
      this.logger.info(`${name} listening on port ${port}`);
    });
  }
}

const server = new Server();

server.mapRoutes();
server.listen();
