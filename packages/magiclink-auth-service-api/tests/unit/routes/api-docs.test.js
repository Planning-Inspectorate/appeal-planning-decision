const { use, serve } = require('./router-mock');
require('../../../src/routes/api-docs');

describe('routes/api-docs', () => {
  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith('/', serve);
  });
});
