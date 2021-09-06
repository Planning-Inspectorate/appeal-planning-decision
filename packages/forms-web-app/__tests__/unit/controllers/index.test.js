const { mockReq, mockRes } = require('../mocks');
const indexController = require('../../../src/controllers');

const req = mockReq();
const res = mockRes();

describe('controllers/index', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('getIndex', () => {
    it('should redirect to the expected route', () => {
      indexController.getIndex(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/before-you-appeal');
    });
  });
});
