const swaggerUi = require('swagger-ui-express');
const { mockUse } = require('../../test/utils/mocks');

describe('routes/appeal', () => {
  it('should define the expected routes', () => {
    // eslint-disable-next-line global-require
    require('./apiDocs');

    expect(mockUse).toBeCalledWith('/', swaggerUi.serve);
  });
});
