const magicLinkDataValidator = require('../validators/schema/magiclinkDataValidator');
const ApiError = require('../error/apiError');
const logger = require('../util/logger');

module.exports = async (req, res, next) => {
  try {
    req.body = await magicLinkDataValidator(req.body);

    logger.debug('Magic link request body is valid.');
    return next();
  } catch (err) {
    logger.error({ err }, 'Invalid magic link request body format');
    return next(ApiError.badRequest(err));
  }
};
