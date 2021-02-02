const { get, post } = require('./router-mock');
const { VIEW } = require('../../../src/lib/views');
const areaAppealsController = require('../../../src/controllers/area-appeals');
const { validationErrorHandler } = require('../../../src/validators/validation-error-handler');
const { rules: areaAppealsValidationRules } = require('../../../src/validators/area-appeals');

jest.mock('../../../src/validators/area-appeals');

describe('routes/area-appeals', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/area-appeals');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(`/${VIEW.AREA_APPEALS}`, areaAppealsController.getAreaAppeals);
    expect(post).toHaveBeenCalledWith(
      `/${VIEW.AREA_APPEALS}`,
      areaAppealsValidationRules(),
      validationErrorHandler,
      areaAppealsController.postAreaAppeals
    );
  });
});
