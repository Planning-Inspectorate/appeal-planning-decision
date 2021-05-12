const { createAppealReply, getExistingAppealReply } = require('../lib/appeal-reply-api-wrapper');

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
  if (!req.session || !req.params.id) {
    return next();
  }

  const { id } = req.params;
  try {
    req.session.appealReply = await getExistingAppealReply(id);
  } catch (err) {
    if (err.status === 404) {
      if (process.env.CREATE_REPLY_IF_REPLY_NOT_PRESENT === 'true') {
        req.session.appealReply = await createAppealReply(id);
      }
    } else {
      return next(err);
    }
  }

  return next();
};
