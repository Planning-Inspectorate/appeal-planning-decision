const mockNavigationHistoryMiddleware = jest.fn();
jest.doMock('../../../src/middleware/navigation-history', () => {
  return () => mockNavigationHistoryMiddleware;
});

const { mockReq, mockRes } = require('../mocks');
const setBackLinkFromAppealMiddleware = require('../../../src/middleware/set-back-link-from-appeal');

describe('middleware/set-back-link-from-appeal', () => {
  let mockBackLinkFn;

  beforeEach(() => {
    jest.resetAllMocks();

    mockBackLinkFn = jest.fn();
  });

  [
    {
      title: 'Call next() early if req.session.navigationHistory is not set',
      req: {
        ...mockReq,
        session: {},
      },
      expected: (req, res, next) => {
        expect(next).toHaveBeenCalled();
        expect(mockBackLinkFn).not.toHaveBeenCalled();
      },
    },
    {
      title: 'Call next() early if req.session.appeal.id is not set',
      req: {
        ...mockReq,
        session: {
          navigationHistory: [],
          appeal: {},
        },
      },
      expected: (req, res, next) => {
        expect(next).toHaveBeenCalled();
        expect(mockBackLinkFn).not.toHaveBeenCalled();
      },
    },
    {
      title: 'Add back link to navigationHistory on the happy path',
      req: {
        ...mockReq,
        session: {
          navigationHistory: [],
          appeal: {
            id: '123-xyz',
          },
        },
      },
      expected: (req, res, next) => {
        expect(next).not.toHaveBeenCalled();
        expect(mockBackLinkFn).toHaveBeenCalledWith({
          id: '123-xyz',
        });
        expect(mockNavigationHistoryMiddleware).toHaveBeenCalledWith(req, res, next);
      },
    },
  ].forEach(({ title, req, expected }) => {
    test(title, () => {
      const next = jest.fn();
      const res = mockRes();

      setBackLinkFromAppealMiddleware(mockBackLinkFn)(req, res, next);

      expected(req, res, next);
    });
  });
});
