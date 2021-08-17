const ApiError = require('./apiError');

// eslint-disable-next-line no-unused-vars
function apiErrorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    const errorMessage = {
      code: err.code,
      errors: err.message.errors,
    };
    return res.status(err.code).json(errorMessage);
  }

  return res.status(500).json('Unexpected internal server error while handling API call');
}

module.exports = apiErrorHandler;
