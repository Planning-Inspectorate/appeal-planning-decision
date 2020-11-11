const yourDetailsController = require('../../../src/controllers/your-details');
const { mockReq, mockRes } = require('../mocks');

const req = mockReq();
const res = mockRes();

describe('controller/your-details', () => {
  describe('getYourDetails', () => {
    it('should call the correct template', () => {
      yourDetailsController.getYourDetails(req, res);

      expect(res.render).toHaveBeenCalledWith('your-details/index', { appeal: undefined });
    });
  });

  xdescribe('postYourDetails', () => {
    it('should redirect ', () => {
      yourDetailsController.postYourDetails(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/application-number');
    });
  });
});
