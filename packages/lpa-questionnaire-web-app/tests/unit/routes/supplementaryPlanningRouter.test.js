const { get, post } = require('./router-mock');

const supplementaryDocumentsController = require('../../../src/controllers/supplementary-documents/add-supplementary-documents');

const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');
const combineDateInputsMiddleware = require('../../../src/middleware/combine-date-inputs');
const reqFilesToReqBodyFilesMiddleware = require('../../../src/middleware/req-files-to-req-body-files');
const { validationErrorHandler } = require('../../../src/validators/validation-error-handler');
const supplementaryDocumentsValidationRules = require('../../../src/validators/supplementary-documents');

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
        '/:id/supplementary-documents/add-document',
        [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
        supplementaryDocumentsController.getAddDocument
      );

      expect(post).toHaveBeenCalledWith(
        '/:id/supplementary-documents/add-document',
        reqFilesToReqBodyFilesMiddleware('documents'),
        combineDateInputsMiddleware,
        supplementaryDocumentsValidationRules(),
        validationErrorHandler,
        supplementaryDocumentsController.postAddDocument
      );
    });
  });
});
