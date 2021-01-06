const indexController = require('../../../src/controllers/index');
const { mockReq, mockRes } = require('../mocks');

const req = mockReq();
const res = mockRes();

describe('controllers/index', () => {
  describe('getSubmission', () => {
    it('should call the correct template', () => {
      indexController.getIndex(req, res);

      expect(res.render).toHaveBeenCalledWith('index');
    });
  });
});
