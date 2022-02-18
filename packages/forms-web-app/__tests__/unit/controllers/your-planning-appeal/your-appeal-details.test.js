const appeal = require('@pins/business-rules/test/data/householder-appeal');
const yourAppealDetailsController = require('../../../../src/controllers/your-planning-appeal/your-appeal-details');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

const appealLPD = 'Some LPD name here';
const req = {
  ...mockReq(appeal),
  session: {
    ...mockReq(appeal).session,
    appealLPD,
  },
};
const res = mockRes();

describe('controllers/your-planning-appeal/your-appeal-details', () => {
  describe('getYourAppealDetails', () => {
    it('should call the correct template', () => {
      yourAppealDetailsController.getYourAppealDetails(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.YOUR_PLANNING_APPEAL.YOUR_APPEAL_DETAILS, {
        appeal,
        appealLPD,
      });
    });
  });
});
