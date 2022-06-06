const getEnterAppealDetailsController = require('../../../../src/controllers/submit-appeal/enter-appeal-details');

const { VIEW } = require('../../../../src/lib/submit-appeal/views');
const { mockReq, mockRes } = require('../../mocks');

describe('controllers/submit-appeal/enter-appeal-details', () => {
  const req = mockReq();
  const res = mockRes();

  it('getEnterAppealDetails method calls the correct template', async () => {
    await getEnterAppealDetailsController.getEnterAppealDetails(req, res);

    expect(res.render).toBeCalledWith(VIEW.SUBMIT_APPEAL.ENTER_APPEAL_DETAILS, {});
  });
});
