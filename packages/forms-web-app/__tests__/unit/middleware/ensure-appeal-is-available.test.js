const { mockReq, mockRes } = require('../mocks');
const ensureAppealIsAvailableMiddleware = require('../../../src/middleware/ensure-appeal-is-available');

describe('middleware/ensure-appeal-is-available', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  [
    {
      title: 'Call next() if req.session.appeal.id is set',
      req: {
        ...mockReq,
        session: {
          appeal: {
            id: 'some-good-id',
          },
        },
      },
      expected: (req, res, next) => {
        expect(next).toHaveBeenCalledWith();
        expect(res.status).not.toHaveBeenCalled();
      },
    },
    {
      title: 'Return 400 if req.session.appeal.id is not set',
      req: {
        ...mockReq,
        session: {
          appeal: {
            missing: {
              the: 'expected data shape',
            },
          },
        },
      },
      expected: (req, res, next) => {
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.render).toHaveBeenCalledWith('error/400', {
          message: 'Sorry, we were unable to find the details for your appeal.',
        });
      },
    },
  ].forEach(({ title, req, expected }) => {
    test(title, () => {
      const next = jest.fn();
      const res = mockRes();

      ensureAppealIsAvailableMiddleware(req, res, next);

      expected(req, res, next);
    });
  });
});
