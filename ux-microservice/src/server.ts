import * as bodyParser from 'body-parser';
import App from './app';
import cookieParser from 'cookie-parser';
import HomeController from './controllers/HomeController';

function normalizePort(val: any) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

const app = new App({
  port: normalizePort(process.env.PORT || 3000),
  controllers: [new HomeController()],
  middleWares: [cookieParser(), bodyParser.json(), bodyParser.urlencoded({ extended: true })],
});

app.listen();
