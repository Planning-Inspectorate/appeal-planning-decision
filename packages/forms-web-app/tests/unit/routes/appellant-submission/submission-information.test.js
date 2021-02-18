const { get } = require('../router-mock');
const submissionInformationController = require('../../../../src/controllers/appellant-submission/submission-information');
const fetchAppealByUrlParam = require('../../../../src/middleware/fetch-appeal-by-url-param');
const fetchAppealLpdByAppealLpaCode = require('../../../../src/middleware/fetch-appeal-lpd-by-appeal-lpa-code');

jest.mock('../../../../src/middleware/fetch-appeal-by-url-param');
jest.mock('../../../../src/middleware/fetch-appeal-lpd-by-appeal-lpa-code');

describe('routes/submission-information', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/submission-information');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submission-information/:appealId',
      [fetchAppealByUrlParam('appealId'), fetchAppealLpdByAppealLpaCode],
      submissionInformationController.getSubmissionInformation
    );
  });
});
