const { get, post } = require('./router-mock');
const supplementaryDocumentsController = require('../../../src/controllers/supplementary-documents/add-supplementary-document');
const uploadedDocumentsController = require('../../../src/controllers/supplementary-documents/uploaded-documents');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');
const combineDateInputsMiddleware = require('../../../src/middleware/combine-date-inputs');
const reqFilesToReqBodyFilesMiddleware = require('../../../src/middleware/req-files-to-req-body-files');
const { validationErrorHandler } = require('../../../src/validators/validation-error-handler');
const supplementaryDocumentsValidationRules = require('../../../src/validators/supplementary-documents');
const checkIfSupplementaryDocuments = require('../../../src/middleware/check-if-supplementary-documents');
const deleteSupplementaryDocumentController = require('../../../src/controllers/supplementary-documents/delete-supplementary-document');
const alreadySubmittedMiddleware = require('../../../src/middleware/already-submitted');

jest.mock('../../../src/middleware/req-files-to-req-body-files');
jest.mock('../../../src/validators/supplementary-documents');

describe('routes/supplementary-documents', () => {
  describe('router', () => {
    beforeEach(() => {
      // eslint-disable-next-line global-require
      require('../../../src/routes/supplementary-documents');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should define the expected routes', () => {
      expect(get).toHaveBeenCalledWith(
        '/appeal-questionnaire/:id/supplementary-documents',
        [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, alreadySubmittedMiddleware],
        supplementaryDocumentsController.getAddDocument
      );

      expect(post).toHaveBeenCalledWith(
        '/appeal-questionnaire/:id/supplementary-documents',
        reqFilesToReqBodyFilesMiddleware('documents'),
        combineDateInputsMiddleware,
        supplementaryDocumentsValidationRules(),
        validationErrorHandler,
        supplementaryDocumentsController.postAddDocument
      );

      expect(get).toHaveBeenCalledWith(
        '/appeal-questionnaire/:id/supplementary-documents/uploaded-documents',
        [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, alreadySubmittedMiddleware],
        checkIfSupplementaryDocuments,
        uploadedDocumentsController.getUploadedDocuments
      );

      expect(get).toHaveBeenCalledWith(
        '/appeal-questionnaire/:id/supplementary-documents/delete-document',
        [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, alreadySubmittedMiddleware],
        deleteSupplementaryDocumentController.getDeleteDocument
      );
    });
  });
});
