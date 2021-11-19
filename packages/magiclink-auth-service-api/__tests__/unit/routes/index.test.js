const { use } = require('./router-mock');

const magicLinkRouter = require('../../../src/routes/magiclink');
const apiDocsRouter = require('../../../src/routes/api-docs');
require('../../../src/routes');

describe('routes/index', () => {
  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith(magicLinkRouter);
    expect(use).toHaveBeenCalledWith(apiDocsRouter);
  });
});
