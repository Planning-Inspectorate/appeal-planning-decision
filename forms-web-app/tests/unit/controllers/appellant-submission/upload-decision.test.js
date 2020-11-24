const uploadDecisionController = require('../../../../src/controllers/appellant-submission/upload-decision');
const { mockReq, mockRes } = require('../../mocks');

const req = mockReq();
const res = mockRes();

describe('controller/appellant-submission/upload-decision', () => {
  describe('getUploadDecision', () => {
    it('should call the correct template', () => {
      uploadDecisionController.getUploadDecision(req, res);

      expect(res.render).toHaveBeenCalledWith('appellant-submission/upload-decision');
    });
  });
});
