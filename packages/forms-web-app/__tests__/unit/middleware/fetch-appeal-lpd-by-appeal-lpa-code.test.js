const { mockReq, mockRes } = require('../mocks');
const fetchAppealLpdByAppealLpaCode = require('../../../src/middleware/fetch-appeal-lpd-by-appeal-lpa-code');
const { getDepartmentFromId } = require('../../../src/services/department.service');

jest.mock('../../../src/lib/logger');
jest.mock('../../../src/services/department.service');

describe('middleware/fetch-appeal-lpd-by-appeal-lpa-code', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  [
    {
      title: 'req.session.appeal is undefined',
      setup: () => ({
        req: {
          ...mockReq(),
          session: {},
        },
        res: mockRes(),
      }),
      expected: (req, res, next) => {
        expect(req.session.appeal).toBeUndefined();
        expect(getDepartmentFromId).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        expect(req.session.appealLPD).toBeUndefined();
      },
    },
    {
      title: 'req.session.appeal.lpaCode is undefined',
      setup: () => ({
        req: {
          ...mockReq(),
          session: {
            appeal: {},
          },
        },
        res: mockRes(),
      }),
      expected: (req, res, next) => {
        expect(getDepartmentFromId).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        expect(req.session.appealLPD).toBeUndefined();
      },
    },
    {
      title: 'getDepartmentFromId throws',
      setup: () => {
        getDepartmentFromId.mockRejectedValue(new Error('fake error message'));
        return {
          req: {
            ...mockReq(),
            session: {
              appeal: {
                lpaCode: '123-abc',
              },
            },
          },
          res: mockRes(),
        };
      },
      expected: (req, res, next) => {
        expect(getDepartmentFromId).toHaveBeenCalledWith('123-abc');
        expect(res.status).not.toHaveBeenCalled();
        expect(res.render).not.toHaveBeenCalled();
        expect(req.session.appealLPD).not.toBeDefined();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'happy path',
      setup: () => {
        getDepartmentFromId.mockResolvedValue('some good value here');
        return {
          req: {
            ...mockReq(),
            session: {
              appeal: {
                lpaCode: '123-abc',
              },
            },
          },
          res: mockRes(),
        };
      },
      expected: (req, res, next) => {
        expect(getDepartmentFromId).toHaveBeenCalledWith('123-abc');
        expect(res.status).not.toHaveBeenCalled();
        expect(res.render).not.toHaveBeenCalled();
        expect(req.session.appealLPD).toEqual('some good value here');
        expect(next).toHaveBeenCalled();
      },
    },
  ].forEach(({ title, setup, expected }) => {
    test(title, async () => {
      const next = jest.fn();
      const { req, res } = setup();

      await fetchAppealLpdByAppealLpaCode(req, res, next);

      expected(req, res, next);
    });
  });
});
