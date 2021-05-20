const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const { get, post } = require('../router-mock');
const uploadDecisionController = require('../../../../src/controllers/appellant-submission/upload-decision');
const {
  rules: uploadDecisionValidationRules,
} = require('../../../../src/validators/appellant-submission/upload-decision');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');

jest.mock('../../../../src/validators/appellant-submission/upload-decision');

describe('routes/appellant-submission/upload-decision', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../src/routes/appellant-submission/upload-decision');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/upload-decision',
      [fetchExistingAppealMiddleware],
      uploadDecisionController.getUploadDecision
    );
    expect(post).toHaveBeenCalledWith(
      '/upload-decision',
      uploadDecisionValidationRules(),
      validationErrorHandler,
      uploadDecisionController.postUploadDecision
    );
  });
});
