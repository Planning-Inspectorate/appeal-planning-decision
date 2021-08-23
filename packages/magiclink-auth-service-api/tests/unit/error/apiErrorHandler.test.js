const apiErrorHandler = require('../../../src/error/apiErrorHandler');
const ApiError = require('../../../src/error/apiError');
const { mockReq, mockRes } = require('../mocks');

const req = mockReq();
const res = mockRes();

describe('error.apiErrorHandler', () => {
  describe('with ApiError', () => {
    it('should set the ApiError code and message on the response', () => {
      apiErrorHandler(ApiError.badRequest({ errors: 'Invalid request body' }), req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        errors: 'Invalid request body',
      });
    });
  });

  describe('with generic error', () => {
    it('should set the 500 code and service error message on the response', () => {
      apiErrorHandler(new Error(), req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        'Unexpected internal server error while handling API call',
      );
    });
  });
});
