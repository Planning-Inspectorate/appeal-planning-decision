const { get, post } = require('./router-mock');
const { mockRes } = require('../mocks');

const uploadQuestionController = require('../../../src/controllers/upload-question');

const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');
const clearUploadedFilesMiddleware = require('../../../src/middleware/clear-uploaded-files');
const reqFilesToReqBodyFilesMiddleware = require('../../../src/middleware/req-files-to-req-body-files');

const uploadTasksValidationRules = require('../../../src/validators/upload-tasks');
const { validationErrorHandler } = require('../../../src/validators/validation-error-handler');
const authenticateMiddleware = require('../../../src/middleware/authenticate');

const { VIEW } = require('../../../src/lib/views');

jest.mock('../../../src/middleware/req-files-to-req-body-files');
jest.mock('../../../src/validators/upload-tasks');

describe('routes/upload-plans', () => {
  describe('router', () => {
    beforeEach(() => {
      // eslint-disable-next-line global-require
      require('../../../src/routes/upload-plans');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should define the expected routes', () => {
      // eslint-disable-next-line global-require
      const { getConfig } = require('../../../src/routes/upload-plans');

      expect(get).toHaveBeenCalledWith(
        '/:id/plans',
        [
          authenticateMiddleware,
          fetchAppealMiddleware,
          fetchExistingAppealReplyMiddleware,
          clearUploadedFilesMiddleware,
        ],
        getConfig,
        uploadQuestionController.getUpload
      );

      expect(post).toHaveBeenCalledWith(
        '/:id/plans',
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
      const { getConfig } = require('../../../src/routes/upload-plans');

      const res = mockRes();
      const next = jest.fn();

      getConfig(undefined, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.locals.routeInfo).toEqual({
        sectionName: 'requiredDocumentsSection',
        taskName: 'plansDecision',
        view: VIEW.UPLOAD_PLANS,
        name: 'Upload Plans',
      });
    });
  });
});
