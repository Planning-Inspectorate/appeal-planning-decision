const { get } = require('../router-mock');
const ensureAppealIsAvailableMiddleware = require('../../../../src/middleware/ensure-appeal-is-available');
const fetchAppealLpdByAppealLpaCodeMiddleware = require('../../../../src/middleware/fetch-appeal-lpd-by-appeal-lpa-code');
const setBackLinkFromAppealMiddleware = require('../../../../src/middleware/set-back-link-from-appeal');
const yourAppealDetailsController = require('../../../../src/controllers/your-planning-appeal/your-appeal-details');
const getYourPlanningAppealLink = require('../../../../src/lib/get-your-planning-appeal-link');

jest.mock('../../../../src/lib/get-your-planning-appeal-link');
jest.mock('../../../../src/middleware/set-back-link-from-appeal');

describe('routes/your-planning-appeal/your-appeal-details', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/your-planning-appeal/your-appeal-details');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/your-appeal-details',
      [
        ensureAppealIsAvailableMiddleware,
        fetchAppealLpdByAppealLpaCodeMiddleware,
        setBackLinkFromAppealMiddleware(getYourPlanningAppealLink),
      ],
      yourAppealDetailsController.getYourAppealDetails
    );
  });
});
