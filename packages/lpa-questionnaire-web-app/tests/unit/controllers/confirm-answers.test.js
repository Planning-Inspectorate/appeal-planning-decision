const confirmAnswersController = require('../../../src/controllers/confirm-answers');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');
const checkAnswersSections = require('../../../src/lib/check-answers-sections');

jest.mock('../../../src/lib/check-answers-sections');

describe('controllers/confirm-answers', () => {
  it('should call the correct template', () => {
    checkAnswersSections.mockReturnValue(undefined);
    const req = mockReq();
    const res = mockRes();

    confirmAnswersController(req, res);

    expect(res.render).toHaveBeenCalledWith(VIEW.CONFIRM_ANSWERS, {
      taskListLink: `/mock-id/${VIEW.TASK_LIST}`,
      submissionLink: `/mock-id/${VIEW.INFORMATION_SUBMITTED}`,
    });
  });
});
