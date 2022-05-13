const { get, post } = require('../../router-mock');

const planningObligationPlannedController = require('../../../../../src/controllers//full-appeal/submit-appeal/planning-obligation-planned');

const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../../../src/validators/common/options');

jest.mock('../../../../../src/validators/common/options');

describe('routes/full-appeal/submit-appeal/planning-obligations-planned', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/planning-obligation-planned');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/planning-obligation-planned',
      planningObligationPlannedController.getPlanningObligationPlanned
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/planning-obligation-planned',
      optionsValidationRules(),
      validationErrorHandler,
      planningObligationPlannedController.postPlanningObligationPlanned
    );
    expect(optionsValidationRules).toHaveBeenCalledWith({
      fieldName: 'plan-to-submit-planning-obligation',
      emptyError: 'Select yes if you plan to submit a planning obligation',
      validOptions: ['yes', 'no'],
    });
  });
});
