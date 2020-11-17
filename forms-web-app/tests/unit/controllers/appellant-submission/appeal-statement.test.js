const groundsAppealController = require('../../../../src/controllers/appellant-submission/appeal-statement');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

const req = mockReq();
const res = mockRes();

describe('controllers/appellant-submission/grounds-appeal', () => {
  describe('getGroundsOfAppeal', () => {
    it('calls the correct template', () => {
      groundsAppealController.getGroundsOfAppeal(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION_APPEAL_STATEMENT);
    });
  });

  describe('postSaveAppeal', () => {
    it('should redirect on the happy path', () => {
      const mockRequest = {
        body: {
          'privacy-safe': 'true',
        },
      };
      const mockResponse = {
        redirect: jest.fn(),
      };

      groundsAppealController.postSaveAppeal(mockRequest, mockResponse);

      expect(mockResponse.redirect).toHaveBeenCalledWith(`/${VIEW.SUPPORTING_DOCUMENTS}`);
    });
    it('calls the correct template on error', () => {
      const mockRequest = {
        body: {
          errors: [1, 2, 3],
        },
      };

      groundsAppealController.postSaveAppeal(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION_APPEAL_STATEMENT, {
        errorSummary: {},
        errors: [1, 2, 3],
      });
    });
  });
});
