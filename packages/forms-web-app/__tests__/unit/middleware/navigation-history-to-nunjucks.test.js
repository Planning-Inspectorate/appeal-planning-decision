const { mockReq, mockRes } = require('../mocks');
const navigationHistoryToNunjucksMiddleware = require('../../../src/middleware/navigation-history-to-nunjucks');

describe('middleware/navigation-history-to-nunjucks', () => {
  let addGlobal;
  let env;

  beforeEach(() => {
    addGlobal = jest.fn();

    env = {
      addGlobal,
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should add the navigation history as a nunjucks global variable', () => {
    const fakeNavHistory = ['/a', '/b/', '/c'];

    const req = {
      ...mockReq(),
      session: {
        navigationHistory: fakeNavHistory,
      },
    };
    const next = jest.fn();

    navigationHistoryToNunjucksMiddleware(env)(req, mockRes(), next);

    expect(env.addGlobal).toHaveBeenCalledWith('navigation', fakeNavHistory);
    expect(next).toHaveBeenCalled();
  });
});
