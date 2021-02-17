const { insertAppeal } = require('./schemas/insert-appeal');
const { updateAppeal } = require('./schemas/update-appeal');
const { isAppealSubmitted } = require('../../services/appeal.service');
const logger = require('../../lib/logger');
const ApiError = require('../../error/apiError');

const appealUpdateValidationRules = async (req, res, next) => {
  try {
    req.body = await updateAppeal.validate(req.body, { abortEarly: false });
    logger.debug('Valid input format');

    const appealId = req.body.id;
    const pathId = req.params.id;

    if (appealId && pathId !== appealId) {
      return next(ApiError.notSameId());
    }

    return next();
  } catch (err) {
    return next(ApiError.badRequest(err));
  }
};

const appealInsertValidationRules = async (req, res, next) => {
  try {
    req.body = await insertAppeal.validate(req.body, { abortEarly: false });
    logger.debug('Valid input format');

    const appealId = req.body.id;
    const pathId = req.params.id;
    if (await isAppealSubmitted(appealId)) {
      logger.debug('Appeal is already submitted so end processing request with 409 response');
      return next(ApiError.appealAlreadySubmitted());
    }

    if (pathId !== appealId) {
      return next(ApiError.notSameId());
    }

    return next();
  } catch (err) {
    logger.debug(err);
    return next(ApiError.badRequest(err));
  }
};

module.exports = {
  appealUpdateValidationRules,
  appealInsertValidationRules,
};
