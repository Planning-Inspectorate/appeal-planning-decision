const { get } = require('../router-mock');
const confirmationController = require('../../../../src/controllers/appellant-submission/confirmation');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');

jest.mock('../../../../src/middleware/fetch-existing-appeal');

describe('routes/appellant-submission/confirmation', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/confirmation');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/confirmation',
      [fetchExistingAppealMiddleware],
      confirmationController.getConfirmation
    );
  });
});
