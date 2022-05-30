const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
  getPlanningObligationStatus,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-obligation-status');

const { VIEW } = require('../../../../../src/lib/full-appeal/views');

const { mockReq, mockRes } = require('../../../mocks');

describe('controllers/full-appeal/submit-appeal/planning-obligation-status', () => {
  let req;
  let res;

  beforeEach(() => {
    req = v8.deserialize(
      v8.serialize({
        ...mockReq(appeal),
        body: {},
      })
    );
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getPlanningObligationStatus', () => {
    it('calls getPlanningObligationStatus with the  correct template', async () => {
      req.session.appeal.appealDocumentsSection.planningObligations = {
        planningObligationStatus: 'not_started',
      };
      await getPlanningObligationStatus(req, res);
      expect(res.render).toBeCalledWith(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_STATUS, {
        planningObligationStatus: 'not_started',
      });
    });
  });
});
