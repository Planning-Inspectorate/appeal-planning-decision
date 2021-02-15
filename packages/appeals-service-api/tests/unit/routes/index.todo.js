const { use } = require('./router-mock');
const appealsRouter = require('../../../src/routes/appeals');
const planningAuthoritiesRouter = require('../../../src/routes/local-planning-authorities');
const apiDocsRouter = require('../../../src/routes/api-docs');

describe('routes/index', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(use).toHaveBeenCalledWith('/api/v1/appeals', appealsRouter);
    expect(use).toHaveBeenCalledWith(
      '/api/v1/local-planning-authorities',
      planningAuthoritiesRouter
    );
    expect(use).toHaveBeenCalledWith('/api-docs', apiDocsRouter);
    expect(use.mock.calls.length).toBe(3);
  });
});
