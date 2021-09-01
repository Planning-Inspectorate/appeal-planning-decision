const indexController = require('../../../src/controllers');
const { mockReq, mockRes } = require('../mocks');

const req = {
  ...mockReq(),
  params: {
    id: '123-abc',
  },
};
const res = mockRes();

describe('controllers/index', () => {
  describe('getSubmission', () => {
    it('should call the correct template', () => {
      indexController.getIndex(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/appeal-questionnaire/123-abc/task-list');
    });
  });
});
