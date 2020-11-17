const { getExistingAppeal } = require('../lib/appeals-api-wrapper');

/**
 * Middleware to ensure any route that needs the appeal form data can have it pre-populated when the
 * controller action is invoked.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports = async (req, res, next) => {
  if (!req.session || !req.session.uuid) {
    return next();
  }

  try {
    req.log.debug({ uuid: req.session.uuid }, 'Get existing appeal');
    req.session.appeal = await getExistingAppeal(req.session.uuid);
  } catch (err) {
    req.log.debug({ err }, 'Error retrieving appeal');
    req.session.appeal = {};
  }

  return next();
};
