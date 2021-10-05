const swaggerUi = require('swagger-ui-express');
const { use } = require('./router-mock');

describe('routes/api-docs', () => {
  it('should define the expected routes', () => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/api-docs');

    expect(use).toHaveBeenCalledWith('/', swaggerUi.serve);
  });
});
