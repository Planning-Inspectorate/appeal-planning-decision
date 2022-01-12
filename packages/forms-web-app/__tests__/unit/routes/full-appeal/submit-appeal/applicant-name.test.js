const { get, post } = require('../../router-mock');
const applicantNameController = require('../../../../../src/controllers/full-appeal/submit-appeal/applicant-name');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: applicantNameValidationRules,
} = require('../../../../../src/validators/full-appeal/applicant-name');

jest.mock('../../../../../src/validators/full-appeal/applicant-name');

describe('routes/full-appeal/submnit-appeal/applicant-name', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/applicant-name');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/applicant-name',
      [fetchExistingAppealMiddleware],
      applicantNameController.getApplicantName
    );

    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/applicant-name',
      applicantNameValidationRules(),
      validationErrorHandler,
      applicantNameController.postApplicantName
    );
  });
});
