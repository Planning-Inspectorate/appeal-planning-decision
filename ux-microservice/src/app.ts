import express, { Application } from 'express';
import logger from './services/logger';
import path from 'path';
import nunjucks, { ConfigureOptions } from 'nunjucks';

class App {
  public app: Application;

  public port: number;

  constructor(appInit: { port: number; middleWares: any; controllers: any }) {
    this.app = express();
    this.port = appInit.port;

    this.middlewares(appInit.middleWares);
    this.routes(appInit.controllers);
    this.assets();
    this.template();
  }

  private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void }) {
    middleWares.forEach((middleWare) => {
      this.app.use(middleWare);
    });
  }

  private routes(controllers: { forEach: (arg0: (controller: any) => void) => void }) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private assets() {
    this.app.use(express.static('public'));
    this.app.use(express.static('views'));
    this.app.use('/public', express.static(path.join(__dirname, '/public')));
    this.app.use(
      '../node_modules/govuk-frontend',
      express.static('../node_modules/govuk-frontend'),
    );

    const isDev = this.app.get('env') === 'development';

    const nunjucksConfig: ConfigureOptions = {
      autoescape: true,
      noCache: true,
      watch: isDev,
      express: this.app,
    };

    const viewPaths = [
      path.join(__dirname, '../node_modules/govuk-frontend'),
      path.join(__dirname, '/views'),
    ];

    nunjucks.configure(viewPaths, nunjucksConfig);
  }

  private template() {
    this.app.set('views', path.join(__dirname, '/views'));
    this.app.set('view engine', 'njk');
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`App listening on ${this.port}`);
    });
  }
}

export default App;
