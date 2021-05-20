const { mockReq, mockRes } = require('../mocks');
const flashMessageCleanupMiddleware = require('../../src/middleware/flash-message-cleanup');

describe('middleware/flash-message-cleanup', () => {
  let message1;
  let message2;
  let message3;

  beforeEach(() => {
    message1 = { a: 'b' };
    message2 = { c: 'd' };
    message3 = { e: 'f' };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  [
    {
      title: 'falls back to an empty array if req.session.flashMessages is undefined',
      given: () => ({
        req: mockReq(),
        res: mockRes(),
      }),
      expected: (res) => {
        expect(res.locals.flashMessages).toEqual([]);
      },
    },
    {
      title: 'works with a single flash message',
      given: () => ({
        req: {
          ...mockReq(),
          session: {
            flashMessages: [message1],
          },
        },
        res: mockRes(),
      }),
      expected: (res) => {
        expect(res.locals.flashMessages).toEqual([message1]);
      },
    },
    {
      title: 'works with a more than one flash message',
      given: () => ({
        req: {
          ...mockReq(),
          session: {
            flashMessages: [message1, message3, message2],
          },
        },
        res: mockRes(),
      }),
      expected: (res) => {
        expect(res.locals.flashMessages).toEqual([message1, message3, message2]);
      },
    },
  ].forEach(({ title, given, expected }) => {
    it(title, () => {
      const next = jest.fn();
      const { req, res } = given();

      flashMessageCleanupMiddleware(req, res, next);

      // common to all
      expect(req.session.flashMessages).toHaveLength(0);
      expect(next).toHaveBeenCalled();
      // unique to this test
      expected(res);
    });
  });
});
