const controllers = require('./controllers');
const functional = require('./functional');
const healthcheck = require('./health');
const middleware = require('./middleware');
const nunjucks = require('./nunjucks');
const prometheus = require('./prometheus');
const routes = require('./routes');
const utils = require('./utils');

module.exports = {
  controllers,
  functional,
  healthcheck,
  middleware,
  nunjucks,
  prometheus,
  routes,
  utils,
};
