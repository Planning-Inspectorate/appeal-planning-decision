const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { PLANNING_OBLIGATION_DEADLINE, TASK_LIST },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDocumentsSection';
const taskName = 'planningObligations';

const getPlanningObligationDeadline = (req, res) => {
  logger.debug(req.session.appeal);
  const { planningObligationDeadline } = req.session.appeal[sectionName][taskName];

  res.render(PLANNING_OBLIGATION_DEADLINE, {
    planningObligationDeadline,
  });
};

const postPlanningObligationDeadline = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  if (Object.keys(errors).length > 0) {
    return res.render(PLANNING_OBLIGATION_DEADLINE, {
      appeal,
      errors,
      errorSummary,
    });
  }

  const planningObligationDeadline = body['planning-obligation-deadline'];

  try {
    appeal[sectionName][taskName].planningObligationDeadline = planningObligationDeadline;
    appeal.sectionStates[sectionName].planningObligationDeadline = COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(PLANNING_OBLIGATION_DEADLINE, {
      planningObligationDeadline,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${TASK_LIST}`);
};

module.exports = {
  getPlanningObligationDeadline,
  postPlanningObligationDeadline,
};