const { documentTypes } = require('@pins/common');
const { get, post } = require('./router-mock');
const { mockRes, mockReq } = require('../mocks');

const uploadQuestionController = require('../../../src/controllers/upload-question');

const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');
const clearUploadedFilesMiddleware = require('../../../src/middleware/clear-uploaded-files');
const reqFilesToReqBodyFilesMiddleware = require('../../../src/middleware/req-files-to-req-body-files');
const alreadySubmittedMiddleware = require('../../../src/middleware/already-submitted');

const uploadTasksValidationRules = require('../../../src/validators/upload-tasks');
const { validationErrorHandler } = require('../../../src/validators/validation-error-handler');
const authenticateMiddleware = require('../../../src/middleware/authenticate');

const { VIEW } = require('../../../src/lib/views');

jest.mock('../../../src/middleware/req-files-to-req-body-files');
jest.mock('../../../src/validators/upload-tasks');

describe('routes/representations', () => {
  describe('router', () => {
    beforeEach(() => {
      // eslint-disable-next-line global-require
      require('../../../src/routes/representations');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should define the expected routes', () => {
      // eslint-disable-next-line global-require
      const { getConfig } = require('../../../src/routes/representations');

      expect(get).toHaveBeenCalledWith(
        '/appeal-questionnaire/:id/representations',
        [
          authenticateMiddleware,
          fetchAppealMiddleware,
          fetchExistingAppealReplyMiddleware,
          clearUploadedFilesMiddleware,
          alreadySubmittedMiddleware,
        ],
        getConfig,
        uploadQuestionController.getUpload
      );

      expect(post).toHaveBeenCalledWith(
        '/appeal-questionnaire/:id/representations',
        [
          authenticateMiddleware,
          reqFilesToReqBodyFilesMiddleware('documents'),
          uploadTasksValidationRules(),
        ],
        validationErrorHandler,
        getConfig,
        uploadQuestionController.postUpload
      );
    });
  });

  describe('getConfig', () => {
    it('should define the expected config', () => {
      // eslint-disable-next-line global-require
      const { getConfig } = require('../../../src/routes/representations');

      const req = mockReq();
      const res = mockRes();
      const next = jest.fn();

      getConfig(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.locals.routeInfo).toEqual({
        sectionName: 'optionalDocumentsSection',
        taskName: 'representationsInterestedParties',
        view: VIEW.REPRESENTATIONS,
        name: 'Representations from interested parties',
      });
      expect(req.documentType).toEqual(documentTypes.representations.name);
    });
  });
});
