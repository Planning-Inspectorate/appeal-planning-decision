const { get } = require('./router-mock');
const confirmationController = require('../../../src/controllers/confirmation');
const fetchExistingAppealMiddleware = require('../../../src/middleware/fetch-existing-appeal');

jest.mock('../../../src/middleware/fetch-existing-appeal');

describe('routes/confirmation', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/confirmation');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/',
      [fetchExistingAppealMiddleware],
      confirmationController.getConfirmation
    );
  });
});
