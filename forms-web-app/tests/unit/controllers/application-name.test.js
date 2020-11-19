const applicationNameController = require('../../../src/controllers/application-name');
const { VIEW } = require('../../../src/lib/views');

const { mockReq, mockRes } = require('../mocks');

const req = mockReq();
const res = mockRes();

describe('controller/application-name', () => {
  describe('getApplicationName', () => {
    it('should call the correct template', () => {
      applicationNameController.getApplicationName(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPLICATION_NAME);
    });
  });

  describe('postApplicationName', () => {
    it('should redirect ', () => {
      applicationNameController.postApplicationName(req, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.TASK_LIST}`);
    });
  });
});
