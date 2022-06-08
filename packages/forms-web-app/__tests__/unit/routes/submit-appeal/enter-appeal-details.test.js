const { get, post } = require('../router-mock');

const enterAppealDetailsController = require('../../../../src/controllers/submit-appeal/enter-appeal-details');

const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: validateEmailAddressRules,
} = require('../../../../src/validators/common/email-address');
const {
  rules: validatePlanningApplicationNumberRules,
} = require('../../../../src/validators/common/application-number');

jest.mock('../../../../src/validators/common/email-address');
jest.mock('../../../../src/validators/common/application-number');

describe('routes/submit-appeal/enter-appeal-details', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/submit-appeal');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/enter-appeal-details',
      enterAppealDetailsController.getEnterAppealDetails
    );
    expect(post).toHaveBeenCalledWith(
      '/enter-appeal-details',
      validateEmailAddressRules(),
      validatePlanningApplicationNumberRules(),
      validationErrorHandler,
      enterAppealDetailsController.postEnterAppealDetails
    );
  });
});
