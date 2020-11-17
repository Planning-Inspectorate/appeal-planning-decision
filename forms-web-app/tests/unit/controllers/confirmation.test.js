const confirmationController = require('../../../src/controllers/confirmation');
const { mockReq, mockRes } = require('../mocks');

const req = mockReq();
const res = mockRes();

describe('controller/confirmation', () => {
  describe('getConfirmation', () => {
    it('should call the correct template', () => {
      confirmationController.getConfirmation(req, res);

      expect(res.render).toHaveBeenCalledWith('confirmation/index', { appellantEmail: undefined });
    });
  });
});
