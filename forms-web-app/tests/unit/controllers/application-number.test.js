const applicationNumberController = require('../../../src/controllers/application-number');
const { mockReq, mockRes } = require('../mocks');
const { VIEW } = require('../../../src/lib/views');

const req = mockReq();
const res = mockRes();

describe('controller/application-number', () => {
  describe('getApplicationNumber', () => {
    it('should call the correct template', () => {
      applicationNumberController.getApplicationNumber(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPLICATION_NUMBER);
    });
  });

  describe('postApplicationNumber', () => {
    it('should redirect ', () => {
      applicationNumberController.postApplicationNumber(req, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);
    });
  });
});
