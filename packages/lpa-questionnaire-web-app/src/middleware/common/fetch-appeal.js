const { validate: validateUuid } = require('uuid');
const { getAppeal } = require('../../lib/appeals-api-wrapper');

/**
 * Middleware to ensure any appeal data is populated
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
    req.log.debug({ appealId }, 'Get existing appeal');

    req.session.appeal = await getAppeal(appealId);
  } catch (err) {
    req.log.debug({ err }, 'Error retrieving appeal');

    res.status(404).send();
    return;
  }

  next();
};
