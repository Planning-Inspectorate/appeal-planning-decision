const { mockReq, mockRes } = require('../mocks');
const flashMessageToNunjucksMiddleware = require('../../../src/middleware/flash-message-to-nunjucks');

describe('middleware/flash-message-to-nunjucks', () => {
  let message1;
  let message2;

  let addGlobal;
  let env;

  beforeEach(() => {
    message1 = { a: 'b' };
    message2 = { c: 'd' };

    addGlobal = jest.fn();

    env = {
      addGlobal,
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  [
    {
      title: 'falls back to an empty array if res.locals.flashMessages is undefined',
      given: () => mockRes(),
      expected: () => {
        expect(env.addGlobal).toHaveBeenCalledWith('flashMessages', []);
      },
    },
    {
      title: 'works with a single flash message',
      given: () => ({
        ...mockRes(),
        locals: {
          flashMessages: [message1],
        },
      }),
      expected: () => {
        expect(env.addGlobal).toHaveBeenCalledWith('flashMessages', [message1]);
      },
    },
    {
      title: 'works with a more than one flash message',
      given: () => ({
        ...mockRes(),
        locals: {
          flashMessages: [message1, message2],
        },
      }),
      expected: () => {
        expect(env.addGlobal).toHaveBeenCalledWith('flashMessages', [message1, message2]);
      },
    },
  ].forEach(({ title, given, expected }) => {
    it(title, () => {
      const next = jest.fn();
      const req = mockReq();
      const res = given();

      flashMessageToNunjucksMiddleware(env)(req, res, next);

      // common to all
      expect(next).toHaveBeenCalled();
      // unique to this test
      expected();
    });
  });
});
