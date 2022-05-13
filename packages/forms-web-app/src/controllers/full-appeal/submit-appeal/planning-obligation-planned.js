const { VIEW } = require('../../../lib/full-appeal/views');

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
    ? `/${VIEW.FULL_APPEAL.NEW_PLANS_DRAWINGS}`
    : `/${VIEW.FULL_APPEAL.PLANS_DRAWINGS}`;
};

const getPlanningObligationPlanned = async (req, res) => {
  const backLink = getBackLink(req);
  res.render(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED, { backLink });
};

const postPlanningObligationPlanned = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const backLink = getBackLink(req);

  if (Object.keys(errors).length > 0) {
    return res.render(VIEW.FULL_APPEAL.PLANNING_OBLIGATION_PLANNED, {
      errors,
      errorSummary,
      backLink,
    });
  }

  return body['plan-to-submit-planning-obligation'] === 'yes'
    ? res.redirect(`/${VIEW.FULL_APPEAL.PLANNING_OBLIGATION_STATUS}`)
    : res.redirect(`/${VIEW.FULL_APPEAL.SUPPORTING_DOCUMENTS}`);
};

module.exports = { getPlanningObligationPlanned, postPlanningObligationPlanned };
