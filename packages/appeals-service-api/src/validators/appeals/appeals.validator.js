const { insertAppeal } = require('./schemas/insert-appeal');
const { updateAppeal } = require('./schemas/update-appeal');
const ApiError = require('../../error/apiError');

const appealUpdateValidationRules = async (req, res, next) => {
  try {
    req.body = await updateAppeal.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
};

const appealInsertValidationRules = async (req, res, next) => {
  try {
    req.body = await insertAppeal.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
};

module.exports = {
  appealUpdateValidationRules,
  appealInsertValidationRules,
};
