const { get, post } = require('./router-mock');
const uploadPlansController = require('../../../src/controllers/upload-plans');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');
const clearUploadedFilesMiddleware = require('../../../src/middleware/clear-uploaded-files');
const reqFilesToReqBodyFilesMiddleware = require('../../../src/middleware/req-files-to-req-body-files');
const uploadPlansValidationRules = require('../../../src/validators/upload-plans');
const { validationErrorHandler } = require('../../../src/validators/validation-error-handler');

jest.mock('../../../src/middleware/req-files-to-req-body-files');
jest.mock('../../../src/validators/upload-plans');

describe('routes/upload-plans', () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    require('../../../src/routes/upload-plans');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should define the expected routes', () => {
    expect(get).toHaveBeenCalledWith(
      '/:id/plans',
      [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, clearUploadedFilesMiddleware],
      uploadPlansController.getUploadPlans
    );

    expect(post).toHaveBeenCalledWith(
      '/:id/plans',
      [reqFilesToReqBodyFilesMiddleware('documents'), uploadPlansValidationRules()],
      validationErrorHandler,
      uploadPlansController.postUploadPlans
    );
  });
});
