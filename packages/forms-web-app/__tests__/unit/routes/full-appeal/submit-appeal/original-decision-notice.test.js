const { documentTypes } = require('@pins/common');
const { get, post } = require('../../router-mock');
const {
  getOriginalDecisionNotice,
  postOriginalDecisionNotice,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/original-decision-notice');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: fileUploadValidationRules,
} = require('../../../../../src/validators/common/file-upload');
const setSectionAndTaskNames = require('../../../../../src/middleware/set-section-and-task-names');

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/file-upload');
jest.mock('../../../../../src/middleware/set-section-and-task-names');

describe('routes/full-appeal/submit-appeal/application-form', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../../../src/routes/full-appeal/submit-appeal/original-decision-notice');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/original-decision-notice',
      [fetchExistingAppealMiddleware],
      setSectionAndTaskNames(),
      getOriginalDecisionNotice
    );
    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/original-decision-notice',
      setSectionAndTaskNames(),
      fileUploadValidationRules(),
      validationErrorHandler,
      postOriginalDecisionNotice
    );
    expect(fileUploadValidationRules).toHaveBeenCalledWith(
      'Select the decision notice from your original planning application'
    );
    expect(setSectionAndTaskNames).toHaveBeenCalledWith(
      'planningApplicationDocumentsSection',
      documentTypes.originalDecisionNotice.name
    );
  });
});
