const { get, post } = require('../../router-mock');
const { documentTypes } = require('@pins/common');

const certificatesController = require('../../../../../src/controllers/full-appeal/submit-appeal/certificates');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
  validationErrorHandler,
} = require('../../../../../src/validators/validation-error-handler');
const {
  rules: fileUploadValidationRules,
} = require('../../../../../src/validators/common/file-upload');
const setSectionAndTaskNames = require('../../../../../src/middleware/set-section-and-task-names');
const sectionName = 'planningApplicationDocumentsSection';
const taskName = documentTypes.ownershipCertificate.name;

jest.mock('../../../../../src/middleware/fetch-existing-appeal');
jest.mock('../../../../../src/validators/common/file-upload');
jest.mock('../../../../../src/middleware/set-section-and-task-names');

describe('routes/full-appeal/submit-appeal/certificates', () => {
  beforeEach(() => {
    require('../../../../../src/routes/full-appeal/submit-appeal/certificates');
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/submit-appeal/certificates',
      [fetchExistingAppealMiddleware],
      setSectionAndTaskNames(sectionName, taskName),
      certificatesController.getCertificates
    );

    expect(post).toHaveBeenCalledWith(
      '/submit-appeal/certificates',
      setSectionAndTaskNames(sectionName, taskName),
      fileUploadValidationRules(
        'Select your ownership certificate and agricultural land declaration'
      ),
      validationErrorHandler,
      certificatesController.postCertificates
    );

    expect(fileUploadValidationRules).toHaveBeenCalledWith(
      'Select your ownership certificate and agricultural land declaration'
    );

    expect(setSectionAndTaskNames).toHaveBeenCalledWith(
      'planningApplicationDocumentsSection',
      documentTypes.ownershipCertificate.name
    );
  });
});
