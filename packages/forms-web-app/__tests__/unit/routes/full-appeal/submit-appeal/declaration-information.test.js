const { get } = require('../../router-mock');
const declarationInformationController = require('../../../../../src/controllers/full-appeal/submit-appeal/declaration-information');
const fetchAppealByUrlParam = require('../../../../../src/middleware/fetch-appeal-by-url-param');
const fetchAppealLpdByAppealLpaCode = require('../../../../../src/middleware/fetch-appeal-lpd-by-appeal-lpa-code');

jest.mock('../../../../../src/middleware/fetch-appeal-by-url-param');
jest.mock('../../../../../src/middleware/fetch-appeal-lpd-by-appeal-lpa-code');

describe('routes/full-appeal/submit-appeal/declaration-information', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/declaration-information');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/declaration-information/:appealId',
      [fetchAppealByUrlParam('appealId'), fetchAppealLpdByAppealLpaCode],
      declarationInformationController.getDeclarationInformation
    );
  });
});
