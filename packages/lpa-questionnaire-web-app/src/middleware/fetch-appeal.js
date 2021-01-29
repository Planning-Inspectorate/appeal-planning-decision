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
  if (!req.session) {
    return next();
  }

  if ((!req.session.appeal || !req.session.appeal.id) && req.params && req.params.id) {
    try {
      req.log.debug({ id: req.params.id }, 'Get existing appeal');
      req.session.appeal = await getAppeal(req.params.id);
    } catch (err) {
      req.log.debug({ err }, 'Error retrieving appeal');
      req.session.appeal = null;
    }
  }

  return next();
};
