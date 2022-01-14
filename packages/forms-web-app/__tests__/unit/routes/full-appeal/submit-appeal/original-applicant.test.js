const { get, post } = require('../../router-mock');
const originalApplicantController = require('../../../../../src/controllers/full-appeal/submit-appeal/original-applicant');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: originalApplicantValidationRules,
} = require('../../../../../src/validators/full-appeal/original-applicant');

jest.mock('../../../../../src/validators/full-appeal/original-applicant');

describe('routes/full-appeal/submit-appeal/original-applicant', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/original-applicant');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/original-applicant',
      [fetchExistingAppealMiddleware],
      originalApplicantController.getOriginalApplicant
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/original-applicant',
      originalApplicantValidationRules(),
      validationErrorHandler,
      originalApplicantController.postOriginalApplicant
    );
  });
});
