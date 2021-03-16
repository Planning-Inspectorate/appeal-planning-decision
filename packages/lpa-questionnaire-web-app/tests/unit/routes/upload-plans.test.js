const { get } = require('./router-mock');
const uploadPlansController = require('../../../src/controllers/upload-plans');
const fetchExistingAppealReplyMiddleware = require('../../../src/middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../../src/middleware/fetch-appeal');
const clearUploadedFilesMiddleware = require('../../../src/middleware/clear-uploaded-files');

describe('routes/placeholder', () => {
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
  });
});
