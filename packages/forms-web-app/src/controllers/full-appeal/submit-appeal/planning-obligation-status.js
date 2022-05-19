const {
  constants: {
    PLANNING_OBLIGATION_STATUS: {
      FINALISED: PLANNING_OBLIGATION_STATUS_FINALISED,
      DRAFT: PLANNING_OBLIGATION_STATUS_DRAFT,
      NOT_STARTED: PLANNING_OBLIGATION_NOT_STARTED,
    },
  },
} = require('@pins/business-rules');
const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { PLANNING_OBLIGATION_STATUS, SUPPORTING_DOCUMENTS },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDocumentsSection';
const taskName = 'planningObligationStatus';

const getPlanningObligationStatus = (req, res) => {
  const {
    [sectionName]: {
      [taskName]: { planningObligationStatus },
    },
  } = req.session.appeal;

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
      appeal,
      errors,
      errorSummary,
    });
  }

  const planningObligationStatus = body['planning-obligation-status'] || {};

  logger.debug('=====================');
  logger.debug(body['planning-obligation-status']);
  logger.debug('=====================');

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
    case PLANNING_OBLIGATION_STATUS_FINALISED:
      return res.redirect(`/${SUPPORTING_DOCUMENTS}`);
    case PLANNING_OBLIGATION_STATUS_DRAFT:
      return res.redirect(`/${SUPPORTING_DOCUMENTS}`);
    case PLANNING_OBLIGATION_NOT_STARTED:
      return res.redirect(`/${SUPPORTING_DOCUMENTS}`);
    default:
      throw Error('Could not find');
  }
};

module.exports = {
  getPlanningObligationStatus,
  postPlanningObligationStatus,
};
