jest.mock('../../../src/lib/appeals-api-wrapper');
const mockAppealsApiWrapper = require('../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../mocks');

const fetchLPA = require('../../../src/middleware/fetch-lpa');

const lpaCode = 'testLpaCode';
const mockLPA = {
  id: 'E69999999',
  name: 'System Test Borough Council',
  inTrial: true,
  email: 'AppealPlanningDecisionTest@planninginspectorate.gov.uk',
  domain: 'planninginspectorate.gov.uk',
  england: true,
  wales: false,
  horizonId: null,
};

describe('middleware/fetch-lpa', () => {
  [
    {
      title: 'call 404 error if no LPA code',
      given: () => ({
        ...mockReq(),
        params: {},
      }),
      expected: (_, res, next) => {
        expect(mockAppealsApiWrapper.getAppeal).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
      },
    },
    {
      title: 'call 404 error if lpa api lookup fails',
      given: () => {
        mockAppealsApiWrapper.getLPA.mockRejectedValue('API is down');

        return {
          ...mockReq(),
          params: {
            lpaCode,
          },
        };
      },
      expected: (_, res, next) => {
        expect(mockAppealsApiWrapper.getAppeal).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
      },
    },
    {
      title: 'set lpa data on request and call next if LPA api call succeeds',
      given: () => {
        mockAppealsApiWrapper.getLPA.mockResolvedValue(mockLPA);
        return {
          ...mockReq(),
          params: {
            lpaCode,
          },
        };
      },
      expected: (req, res, next) => {
        expect(mockAppealsApiWrapper.getLPA).toHaveBeenCalledWith(lpaCode);
        expect(next).toHaveBeenCalled();
        expect(req.lpa).toEqual(mockLPA);
      },
    },
  ].forEach(({ title, given, expected }) => {
    it(title, async () => {
      const next = jest.fn();
      const req = given();
      const res = mockRes();

      await fetchLPA(req, res, next);

      expected(req, res, next);
    });
  });
});
