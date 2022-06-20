const { PLANNING_OBLIGATION_STATUS_OPTION } = require('@pins/business-rules/src/constants');
const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { PLANNING_OBLIGATION_DEADLINE, NEW_DOCUMENTS },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'appealDocumentsSection';
const taskName = 'planningObligationDeadline';

const getPlanningObligationDeadline = (req, res) => {
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

  const planningObligationDeadline = {
    plansPlanningObligation: true,
    planningObligationStatus: PLANNING_OBLIGATION_STATUS_OPTION.NOT_STARTED,
  };

  try {
    appeal[sectionName][taskName].planningObligationDeadline = planningObligationDeadline;
    if (req.body['save-and-return'] !== '') {
      appeal.sectionStates[sectionName].planningObligationDeadlineStatus = COMPLETED;
      req.session.appeal = await createOrUpdateAppeal(appeal);
      return res.redirect(`/${NEW_DOCUMENTS}`);
    }
    appeal.sectionStates[sectionName].planningObligationDeadlineStatus = IN_PROGRESS;
    req.session.appeal = await createOrUpdateAppeal(appeal);
    return await postSaveAndReturn(req, res);
  } catch (err) {
    logger.error(err);
    return res.render(PLANNING_OBLIGATION_DEADLINE, {
      planningObligationDeadline,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }
};

module.exports = {
  getPlanningObligationDeadline,
  postPlanningObligationDeadline,
};
