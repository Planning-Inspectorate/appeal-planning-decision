const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
  getPlanningObligationDeadline,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-obligation-deadline');

const { VIEW } = require('../../../../../src/lib/full-appeal/views');

const { mockReq, mockRes } = require('../../../mocks');

describe('controllers/full-appeal/submit-appeal/planning-obligation-deadline', () => {
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

  describe('getPlanningObligationDeadline', () => {
    it('gets calls correct template', async () => {
      await getPlanningObligationDeadline(req, res);

      expect(res.render).toBeCalledWith(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_DEADLINE, {
        planningObligationDeadline: undefined,
      });
    });
  });
});