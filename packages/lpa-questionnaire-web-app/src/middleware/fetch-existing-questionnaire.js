const {
  createOrUpdateQuestionnaire,
  getExistingQuestionnaire,
} = require('../lib/appeals-api-wrapper');

/**
 * Middleware to ensure any route that needs the questionnaire data can have it pre-populated when the
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

  if (!req.session.questionnaire || !req.session.questionnaire.id) {
    req.session.questionnaire = await createOrUpdateQuestionnaire({});
    return next();
  }

  try {
    req.log.debug({ id: req.session.questionnaire.id }, 'Get existing questionnaire');
    req.session.questionnaire = await getExistingQuestionnaire(req.session.questionnaire.id);
  } catch (err) {
    req.log.debug({ err }, 'Error retrieving questionnaire');
    req.session.questionnaire = await createOrUpdateQuestionnaire({});
  }
  return next();
};
