const applicationNameController = require('../../../src/controllers/application-name');
const { mockReq, mockRes } = require('../mocks');

const req = mockReq();
const res = mockRes();

describe('controller/application-name', () => {
  describe('getApplicationName', () => {
    it('should call the correct template', () => {
      applicationNameController.getApplicationName(req, res);

      expect(res.render).toHaveBeenCalledWith('application-name/index');
    });
  });

  describe('postApplicationName', () => {
    it('should redirect ', () => {
      applicationNameController.postApplicationName(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/task-list');
    });
  });
});
