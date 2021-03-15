const uploadPlansController = require('../../../src/controllers/upload-plans');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/lib/appeal-reply-api-wrapper');
jest.mock('../../../src/services/task.service');
jest.mock('../../../src/lib/logger');

describe('controllers/upload-plans', () => {
  const backLinkUrl = '/mock-id/mock-back-link';

  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getUploadPlans', () => {
    it('should call the correct template', () => {
      req.session.backLink = backLinkUrl;
      uploadPlansController.getUploadPlans(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
        appeal: null,
        backLink: backLinkUrl,
        uploadedFiles: [],
      });
    });

    it('it should have the correct back link when no request session object exists.', () => {
      uploadPlansController.getUploadPlans(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.UPLOAD_PLANS, {
        appeal: null,
        backLink: `/mock-id/${VIEW.TASK_LIST}`,
        uploadedFiles: [],
      });
    });
  });
});
