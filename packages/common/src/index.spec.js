const index = require('./index');
const controllers = require('./controllers');
const functional = require('./functional');
const healthcheck = require('./health');
const middleware = require('./middleware');
const nunjucks = require('./nunjucks');
const prometheus = require('./prometheus');
const routes = require('./routes');
const utils = require('./utils');
const validators = require('./validators');

describe('index', () => {
  it('should expose the underlying modules', () => {
    expect(index).toEqual({
      controllers,
      functional,
      healthcheck,
      middleware,
      nunjucks,
      prometheus,
      routes,
      utils,
      validators,
    });
  });
});
