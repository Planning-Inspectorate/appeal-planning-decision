const { mockReq, mockRes } = require('../mocks');
const getPreviousPagePathMiddleware = require('../../../src/middleware/get-previous-page-path');
const getPreviousPagePathFn = require('../../../src/lib/get-previous-page-path');

jest.mock('../../../src/lib/get-previous-page-path');

describe('middleware/get-previous-page-path', () => {
  it('should set res.locals.previousPagePath', () => {
    const res = mockRes();
    const next = jest.fn();

    const testPagePath = '/abc/123';

    getPreviousPagePathFn.mockReturnValue(testPagePath);

    getPreviousPagePathMiddleware(mockReq(), res, next);

    expect(res.locals.previousPagePath).toEqual(testPagePath);
    expect(next).toHaveBeenCalled();
  });
});
