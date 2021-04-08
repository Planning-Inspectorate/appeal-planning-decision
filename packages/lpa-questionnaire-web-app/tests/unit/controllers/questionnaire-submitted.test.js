const questionnaireSubmittedController = require('../../../src/controllers/questionnaire-submitted');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

describe('getDevelopmentPlan', () => {
  it('should call the correct template', () => {
    const res = mockRes();
    const req = mockReq();

    questionnaireSubmittedController.getQuestionnaireSubmitted(req, res);

    expect(res.render).toHaveBeenCalledWith(VIEW.QUESTIONNAIRE_SUBMITTED, {});
  });
});
