const {
  createAppealReply,
  updateAppealReply,
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
  if (!req.session || !req.params.id) {
    return next();
  }

  const { id } = req.params;
  req.session.appealReply = await getExistingAppealReply(id);

  if (!req.session.appealReply) {
    req.log.debug(`creating new appeal reply for appeal id = ${id}`);
    req.session.appealReply = await createAppealReply();
  }

  req.log.debug(`${id}  -> ${ JSON.stringify(req.session.appealReply)}`);
  return next();
};
