const {
  getPlanningObligationStatus,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-obligation-status');

const { VIEW } = require('../../../../../src/lib/full-appeal/views');

const { mockReq, mockRes } = require('../../../mocks');

describe('controllers/full-appeal/submit-appeal/planning-obligation-status', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getPlanningObligationStatus', () => {
    it('calls correct template', async () => {
      await getPlanningObligationStatus(req, res);
      expect(res.render).toBeCalledWith(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_STATUS);
    });
  });
});
