const { getExistingAppeal } = require('../lib/appeals-api-wrapper');
const logger = require('../lib/logger');

/**
 * Middleware to retrieve an appeal from req.params[appealKey]
 *
 * @param appealKey
 * @returns {(function(*, *, *): Promise<*>)|*}
 */
module.exports = (appealKey) => async (req, res, next) => {
  const appealId = req.params[appealKey];

  if (!appealId) {
    delete req.session.appeal;
    return next();
  }

  try {
    logger.debug({ id: appealId }, `Get existing appeal from req.params[${appealKey}]`);
    req.session.appeal = await getExistingAppeal(appealId);
  } catch (err) {
    logger.debug({ err }, `Error retrieving appeal using req.params[${appealKey}]`);
    delete req.session.appeal;
  }

  return next();
};
