const errorHandler = require('../../../src/error/apiErrorHandler');
const ApiError = require('../../../src/error/apiError');
const { mockRes, mockReq } = require('../mocks');

describe('error/apiErrorHandler', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();
  });

  it('should fall through if not error is not an instance of ApiError', () => {
    errorHandler({}, req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      'Unexpected internal server error while handling API call'
    );
  });

  describe('error is instance of ApiError', () => {
    let code;
    let message;
    let err;

    beforeEach(() => {
      code = 123;
      message = {
        errors: ['a', 'b'],
        inner: [
          { path: 'a.b', errors: ['x', 'y'] },
          { path: 'c', errors: ['q', 'w'] },
        ],
      };
    });

    it('should return early if missing the needed key / values to produce a more descriptive error', () => {
      err = new ApiError(code, 'some message as string when should be object');

      errorHandler(err, req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        'Unexpected internal server error while handling API call'
      );
    });

    it('should return the expected shape', () => {
      err = new ApiError(code, message);

      errorHandler(err, req, res);

      expect(res.status).toHaveBeenCalledWith(code);
      expect(res.json).toHaveBeenCalledWith({
        code: 123,
        errorMap: { 'a.b': ['x', 'y'], c: ['q', 'w'] },
        errors: ['a', 'b'],
      });
    });
  });
});
