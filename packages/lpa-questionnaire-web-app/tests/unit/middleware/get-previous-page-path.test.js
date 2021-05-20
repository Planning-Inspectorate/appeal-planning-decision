const { mockReq, mockRes } = require('../mocks');
const getPreviousPagePathMiddleware = require('../../../src/middleware/get-previous-page-path');
const { VIEW } = require('../../../src/lib/views');

describe('middleware/get-previous-page-path', () => {
  let res;
  let next;

  beforeEach(() => {
    res = mockRes();
    next = jest.fn();

    jest.resetAllMocks();
  });

  it('should use req.session.backLink if available', () => {
    const backLink = '/a/b/c/1/2/3';
    const req = {
      ...mockReq(),
      session: {
        backLink,
      },
    };

    getPreviousPagePathMiddleware(req, res, next);

    expect(res.locals.previousPagePath).toEqual(backLink);
    expect(next).toHaveBeenCalled();
  });

  it('should fall back to the task list', () => {
    const fakeAppealId = 'fake-appeal-id';
    const req = {
      ...mockReq(),
      session: {
        appealId: fakeAppealId,
      },
    };

    getPreviousPagePathMiddleware(req, res, next);

    expect(res.locals.previousPagePath).toEqual(`/${fakeAppealId}/${VIEW.TASK_LIST}`);
    expect(next).toHaveBeenCalled();
  });
});
