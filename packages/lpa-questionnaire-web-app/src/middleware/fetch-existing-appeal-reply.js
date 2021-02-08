const {
  createOrUpdateAppealReply,
  getExistingAppealReply,
} = require('../lib/appeal-reply-api-wrapper');

/**
 * Middleware to ensure any route that needs the appeal reply form data can have it pre-populated when the
 * controller action is invoked.
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

  if (!req.session.appealReply || !req.session.appealReply.id) {
    req.session.appealReply = await createOrUpdateAppealReply({});
    return next();
  }

  try {
    req.log.debug({ id: req.session.appealReply.id }, 'Get existing appeal');
    req.session.appealReply = await getExistingAppealReply(req.session.appealReply.id);
  } catch (err) {
    req.log.debug({ err }, 'Error retrieving appeal');
    req.session.appeal = await createOrUpdateAppealReply({});
  }
  return next();
};
