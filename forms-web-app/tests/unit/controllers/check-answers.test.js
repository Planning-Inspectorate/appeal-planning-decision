const checkAnswersController = require('../../../src/controllers/check-answers');
const { mockReq, mockRes } = require('../mocks');

const req = mockReq();
const res = mockRes();

describe('controller/check-answers', () => {
  describe('getCheckAnswers', () => {
    it('should call the correct template', () => {
      checkAnswersController.getCheckAnswers(req, res);

      expect(res.render).toHaveBeenCalledWith('check-answers/index', { appeal: undefined });
    });
  });
});
