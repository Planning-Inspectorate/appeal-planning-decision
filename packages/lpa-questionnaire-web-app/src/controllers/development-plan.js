const { VIEW } = require('../lib/views');
const getAppealSideBarDetails = require('../lib/appeal-sidebar-details');

exports.getDevelopmentPlan = (req, res) => {
  const developmentPlanSection =
    req.session.appealReply.optionalDocumentsSection.developmentOrNeighbourhood;

  let { hasPlanSubmitted } = developmentPlanSection;

  if (typeof hasPlanSubmitted === 'boolean') {
    hasPlanSubmitted = hasPlanSubmitted ? 'yes' : 'no';
  }

  const values = {
    'has-plan-submitted': hasPlanSubmitted,
    'plan-changes-text': developmentPlanSection.planChanges,
  };

  res.render(VIEW.DEVELOPMENT_PLAN, {
    appeal: getAppealSideBarDetails(req.session.appeal),
    backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
    values,
  });
};
