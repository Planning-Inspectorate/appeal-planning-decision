const appealStatementController = require('../../../../src/controllers/eligibility/appeal-statement');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

const req = mockReq();
const res = mockRes();

describe('controller/eligibility/appeal-statement', () => {
  describe('getNoDecision', () => {
    it('should call the correct template', () => {
      appealStatementController.getAppealStatement(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY_APPEAL_STATEMENT);
    });
  });

  describe('postAppealStatement', () => {
    it('should redirect ', () => {
      appealStatementController.postAppealStatement(req, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.TASK_LIST}`);
    });
  });
});
