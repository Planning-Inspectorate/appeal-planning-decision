const { getAppeal } = require('../lib/appeals-api-wrapper');

/**
 * Middleware to ensure any appeal data is populated
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports = async (req, res, next) => {
  const appealId = req.params && req.params.id;

  if (!req.session || !appealId) {
    return next();
  }

  const { appeal } = req.session;

  if (!appeal || !appeal.id || appeal.id !== appealId) {
    try {
      req.log.debug({ appealId }, 'Get existing appeal');
      req.session.appeal = await getAppeal(appealId);
    } catch (err) {
      req.log.debug({ err }, 'Error retrieving appeal');
      req.session.appeal = null;
    }
  }

  return next();
};
