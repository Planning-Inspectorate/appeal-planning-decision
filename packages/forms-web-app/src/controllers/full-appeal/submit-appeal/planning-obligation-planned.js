const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const { VIEW } = require('../../../lib/full-appeal/views');
const { COMPLETED } = require('../../../services/task-status/task-statuses');
const logger = require('../../../lib/logger');

const sectionName = 'appealDocumentsSection';
const taskName = 'planningObligations';

const getBackLink = (req) => {
  const {
    session: {
      appeal: {
        appealDocumentsSection: {
          plansDrawings: { hasPlansDrawings },
        },
      },
    },
  } = req;
  return hasPlansDrawings
    ? `/${VIEW.FULL_APPEAL.PLANS_DRAWINGS}`
    : `/${VIEW.FULL_APPEAL.NEW_PLANS_DRAWINGS}`;
};

const getPlanningObligationPlanned = async (req, res) => {
  const backLink = getBackLink(req);
  const { plansPlanningObligation } = req.session.appeal[sectionName][taskName];
  res.render(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED, { backLink, plansPlanningObligation });
};

const postPlanningObligationPlanned = async (req, res) => {
  const {
    body,
    session: { appeal },
  } = req;
  const { errors = {}, errorSummary = [] } = body;
  const backLink = getBackLink(req);

  if (Object.keys(errors).length > 0) {
    return res.render(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED, {
      errors,
      errorSummary,
      backLink,
    });
  }

  const plansPlanningObligation = body['plan-to-submit-planning-obligation'] === 'yes';

  try {
    appeal[sectionName][taskName].plansPlanningObligation = plansPlanningObligation;
    appeal.sectionStates[sectionName].plansPlanningObligation = COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED, {
      plansPlanningObligation,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }
  return plansPlanningObligation
    ? res.redirect(`/${VIEW.FULL_APPEAL.PLANNING_OBLIGATION_STATUS}`)
    : res.redirect(`/${VIEW.FULL_APPEAL.NEW_DOCUMENTS}`);
};

module.exports = { getPlanningObligationPlanned, postPlanningObligationPlanned };
