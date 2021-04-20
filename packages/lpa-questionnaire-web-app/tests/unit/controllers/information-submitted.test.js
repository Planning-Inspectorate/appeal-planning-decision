const informationSubmittedController = require('../../../src/controllers/information-submitted');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');

describe('getDevelopmentPlan', () => {
  it('should call the correct template', () => {
    const res = mockRes();
    const req = mockReq();

    informationSubmittedController.getInformationSubmitted(req, res);

    expect(res.render).toHaveBeenCalledWith(VIEW.INFORMATION_SUBMITTED, {});
  });
});
