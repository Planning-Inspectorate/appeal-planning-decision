const appealStatementController = require('../../../../src/controllers/eligibility/appeal-statement');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

const req = mockReq();
const res = mockRes();

describe('controllers/eligibility/appeal-statement', () => {
  describe('getNoDecision', () => {
    it('should call the correct template', () => {
      appealStatementController.getAppealStatement(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.APPEAL_STATEMENT);
    });
  });

  describe('postAppealStatement', () => {
    it('should redirect ', () => {
      appealStatementController.postAppealStatement(req, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);
    });
  });
});
