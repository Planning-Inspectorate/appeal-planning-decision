const checkAnswersController = require('../../../src/controllers/check-answers');
const { mockReq, mockRes } = require('../mocks');
const { VIEW } = require('../../../src/lib/views');

const req = mockReq();
const res = mockRes();

describe('controller/check-answers', () => {
  describe('getCheckAnswers', () => {
    it('should call the correct template', () => {
      checkAnswersController.getCheckAnswers(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.CHECK_ANSWERS, { appeal: undefined });
    });
  });
});
