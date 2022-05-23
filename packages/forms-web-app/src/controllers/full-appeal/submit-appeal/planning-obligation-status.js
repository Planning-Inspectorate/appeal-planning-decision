const {
  constants: { PLANNING_OBLIGATION_STATUS_OPTION },
} = require('@pins/business-rules');
const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: {
      PLANNING_OBLIGATION_STATUS,
      PLANNING_OBLIGATION_DOCUMENTS,
      DRAFT_PLANNING_OBLIGATION,
      NEW_DOCUMENTS,
    },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDocumentsSection';
const taskName = 'planningObligations';

const getPlanningObligationStatus = (req, res) => {
  const { planningObligationStatus } = req.session.appeal[sectionName][taskName];
  res.render(PLANNING_OBLIGATION_STATUS, {
    planningObligationStatus,
  });
};

const postPlanningObligationStatus = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  if (Object.keys(errors).length > 0) {
    return res.render(PLANNING_OBLIGATION_STATUS, {
      errors,
      errorSummary,
    });
  }

  const planningObligationStatus = body['planning-obligation-status'];

  try {
    appeal[sectionName][taskName].planningObligationStatus = planningObligationStatus;
    appeal.sectionStates[sectionName].planningObligationStatus = COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(PLANNING_OBLIGATION_STATUS, {
      planningObligationStatus,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  switch (planningObligationStatus) {
    case PLANNING_OBLIGATION_STATUS_OPTION.FINALISED:
      return res.redirect(`/${PLANNING_OBLIGATION_DOCUMENTS}`);
    case PLANNING_OBLIGATION_STATUS_OPTION.DRAFT:
      return res.redirect(`/${DRAFT_PLANNING_OBLIGATION}`);
    case PLANNING_OBLIGATION_STATUS_OPTION.NOT_STARTED:
      return res.redirect(`/${NEW_DOCUMENTS}`);
    default:
      return res.redirect(`/${PLANNING_OBLIGATION_STATUS}`);
  }
};

module.exports = {
  getPlanningObligationStatus,
  postPlanningObligationStatus,
};
