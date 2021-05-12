const ApiError = require('./apiError');

// eslint-disable-next-line no-unused-vars
function apiErrorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    if (
      !err.message ||
      !err.message.errors ||
      !err.message.inner ||
      !Array.isArray(err.message.inner)
    ) {
      return res.status(500).json('Unexpected internal server ApiError while handling API call');
    }

    const errorMessage = {
      code: err.code,
      errors: err.message.errors,
      errorMap: err.message.inner.reduce(
        (acc, validationError) => ({
          ...acc,
          [validationError.path]: validationError.errors,
        }),
        {}
      ),
    };

    return res.status(err.code).json(errorMessage);
  }

  return res.status(500).json('Unexpected internal server error while handling API call');
}

module.exports = apiErrorHandler;
