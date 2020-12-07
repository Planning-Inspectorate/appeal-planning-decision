const ApiError = require('../error/apiError');

function validateDto(schema) {
  return async (req, res, next) => {
    try {
      req.body = await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (err) {
      next(ApiError.badRequest(err));
    }
  };
}

module.exports = validateDto;
