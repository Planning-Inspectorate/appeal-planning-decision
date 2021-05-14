const { validate: validateUuid } = require('uuid');
const config = require('../config');
const {
  createOrUpdateAppealReply,
  getAppealReplyByAppeal,
} = require('../lib/appeal-reply-api-wrapper');

/**
 * Middleware to ensure any route that needs the appeal reply form data can have it pre-populated when the
 * controller action is invoked. Looks up the appeal reply by the appeal ID
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports = async (req, res, next) => {
  const { id: appealId = '' } = req.params;

  if (!appealId || !validateUuid(appealId)) {
    res.status(404).send();
    return;
  }

  try {
    req.log.debug({ appealId }, 'Get existing appeal reply by appeal ID');

    req.session.appealReply = await getAppealReplyByAppeal(appealId);
  } catch (err) {
    req.log.error({ err }, 'Error retrieving appeal reply');

    if (config.appealReply.allowCreate) {
      req.session.appealReply = await createOrUpdateAppealReply({ appealId });
    } else {
      req.log.info({ appealId }, 'Allow Create is disabled for Get existing appeal, returning 404');

      res.status(404).send();
      return;
    }
  }

  next();
};
