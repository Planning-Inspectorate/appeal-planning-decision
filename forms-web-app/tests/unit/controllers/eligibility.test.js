const eligibilityController = require('../../../src/controllers/eligibility');
const { mockReq, mockRes } = require('../mocks');

const req = mockReq();
const res = mockRes();

describe('Eligibility Controller Tests', () => {
  it('Test the getNoDecision method calls the correct template', () => {
    eligibilityController.getNoDecision(req, res);

    expect(res.render).toHaveBeenCalledWith('eligibility/no-decision');
  });

  it('Test the getDecisionDate method calls the correct template', () => {
    eligibilityController.getDecisionDate(req, res);

    expect(res.render).toHaveBeenCalledWith('eligibility/decision-date');
  });

  it('Test the getDecisionDateExpired method calls the correct template', () => {
    eligibilityController.getDecisionDateExpired(req, res);

    expect(res.render).toHaveBeenCalledWith('eligibility/decision-date-expired');
  });
});
