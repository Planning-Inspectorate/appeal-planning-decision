const { get, post, put, patch } = require('./router-mock');
const appealsController = require('../../../src/controllers/appeals');
const {
  appealUpdateValidationRules,
  appealInsertValidationRules,
} = require('../../../src/validators/appeals/appeals.validator');

jest.mock('../../../src/validators/appeals/appeals.validator');
jest.mock('../../../../common/src/lib/notify/notify-builder', () => ({}));

describe('routes/appeals', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/appeals');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith('/:id', appealsController.getAppeal);
    expect(post).toHaveBeenCalledWith('/', appealsController.createAppeal);
    expect(put).toHaveBeenCalledWith(
      '/:id',
      appealInsertValidationRules,
      appealsController.updateAppeal
    );
    expect(patch).toHaveBeenCalledWith(
      '/:id',
      appealUpdateValidationRules,
      appealsController.updateAppeal
    );
  });
});
