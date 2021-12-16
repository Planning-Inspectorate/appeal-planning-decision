const {
  constants: { APPEAL_ID },
  schemas: { validate },
} = require('@pins/business-rules');
const { isAppealSubmitted } = require('../../services/appeal.service');
const logger = require('../../lib/logger');
const ApiError = require('../../error/apiError');

const appealUpdateValidationRules = async (req, res, next) => {
  try {
    if (!req.body.appealType) {
      req.body.appealType = APPEAL_ID.HOUSEHOLDER;
    }

    req.body = await validate.update(req.body);
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
    if (!req.body.appealType) {
      req.body.appealType = APPEAL_ID.HOUSEHOLDER;
    }

    req.body = await validate.insert(req.body);
    logger.debug('Valid input format');

    const appealId = req.body.id;
    const pathId = req.params.id;

    if (await isAppealSubmitted(appealId)) {
      logger.debug('Appeal is already submitted so end processing request with 409 response');
      return next(ApiError.appealAlreadySubmitted());
    }

    if (appealId && pathId !== appealId) {
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
