/**
 * Middleware to ensure any route that needs the appeal form data can have it pre-populated when the
 * controller action is invoked.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const { EMPTY_APPEAL } = require('../lib/appeals-api-wrapper');
const { getExistingAppeal } = require('../lib/appeals-api-wrapper');

module.exports = async (req, res, next) => {
  if (!req.session) {
    return next();
  }

  if (!req.session.appeal || !req.session.appeal.id) {
    req.session.appeal = JSON.parse(JSON.stringify(EMPTY_APPEAL));
    return next();
  }

  try {
    req.log.debug({ id: req.session.appeal.id }, 'Get existing appeal');
    req.session.appeal = await getExistingAppeal(req.session.appeal.id);
  } catch (err) {
    req.log.debug({ err }, 'Error retrieving appeal');
    req.session.appeal = JSON.parse(JSON.stringify(EMPTY_APPEAL));
  }
  return next();
};
