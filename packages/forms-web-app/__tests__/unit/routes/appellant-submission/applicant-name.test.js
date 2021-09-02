const { get, post } = require('../router-mock');
const applicantNameController = require('../../../../src/controllers/appellant-submission/applicant-name');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
  rules: applicantNameValidationRules,
} = require('../../../../src/validators/appellant-submission/applicant-name');

jest.mock('../../../../src/validators/appellant-submission/applicant-name');

describe('routes/appellant-submission/applicant-name', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/applicant-name');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/applicant-name',
      [fetchExistingAppealMiddleware],
      applicantNameController.getApplicantName
    );

    expect(post).toHaveBeenCalledWith(
      '/applicant-name',
      applicantNameValidationRules(),
      validationErrorHandler,
      applicantNameController.postApplicantName
    );
  });
});
