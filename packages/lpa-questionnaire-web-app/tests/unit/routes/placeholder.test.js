const { get } = require('./router-mock');
const placeholderController = require('../../../src/controllers/placeholder');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');

describe('routes/placeholder', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/placeholder');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/:id/placeholder',
      [fetchAppealMiddleware],
      placeholderController.getPlaceholder
    );
  });
});
