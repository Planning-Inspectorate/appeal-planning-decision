const { mockRes, mockReq } = require('../mocks');
const resLocalsAsNunjucksGlobalEnvVarMiddleware = require('../../../src/middleware/res-locals-as-nunjucks-global-env-var');

describe('middleware/res-locals-as-nunjucks-global-env-var', () => {
  let env;

  beforeEach(() => {
    env = {
      addGlobal: jest.fn(),
    };

    jest.resetAllMocks();
  });

  [
    {
      title: 'env.addGlobal calls when res.locals and req.cookies objects are undefined',
      given: () => ({
        req: mockReq(),
        res: mockRes(),
      }),
      expected: (req, res, next) => {
        expect(env.addGlobal).toHaveBeenCalledWith('res_locals', {});
        expect(env.addGlobal).toHaveBeenCalledWith('cookies', {});
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'env.addGlobal calls when res.locals and req.cookies objects are empty objects',
      given: () => ({
        req: {
          ...mockReq(),
          cookies: {},
        },
        res: {
          ...mockRes(),
          locals: {},
        },
      }),
      expected: (req, res, next) => {
        expect(env.addGlobal).toHaveBeenCalledWith('res_locals', {});
        expect(env.addGlobal).toHaveBeenCalledWith('cookies', {});
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'env.addGlobal calls when res.locals and req.cookies objects are set',
      given: () => ({
        req: {
          ...mockReq(),
          cookies: {
            c: 'd',
          },
        },
        res: {
          ...mockRes(),
          locals: {
            a: 'b',
          },
        },
      }),
      expected: (req, res, next) => {
        expect(env.addGlobal).toHaveBeenCalledWith('res_locals', {
          a: 'b',
        });
        expect(env.addGlobal).toHaveBeenCalledWith('cookies', {
          c: 'd',
        });
        expect(next).toHaveBeenCalled();
      },
    },
  ].forEach(({ title, given, expected }) => {
    it(title, async () => {
      const next = jest.fn();
      const { req, res } = given();

      await resLocalsAsNunjucksGlobalEnvVarMiddleware(env)(req, res, next);

      expected(req, res, next);
    });
  });
});
