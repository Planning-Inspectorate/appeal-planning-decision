const yourAppealDetailsController = require('../../../../src/controllers/your-planning-appeal/your-appeal-details');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');

const appealLPD = 'Some LPD name here';

const req = {
  ...mockReq(),
  session: {
    ...mockReq().session,
    appealLPD,
  },
};
const res = mockRes();

describe('controllers/your-planning-appeal/your-appeal-details', () => {
  describe('getYourAppealDetails', () => {
    it('should call the correct template', () => {
      yourAppealDetailsController.getYourAppealDetails(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.YOUR_PLANNING_APPEAL.YOUR_APPEAL_DETAILS, {
        appeal: APPEAL_DOCUMENT.empty,
        appealLPD,
      });
    });
  });
});
