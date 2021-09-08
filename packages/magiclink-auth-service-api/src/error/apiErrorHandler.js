const ApiError = require('./apiError');

function apiErrorHandler(err, req, res, _) {
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
