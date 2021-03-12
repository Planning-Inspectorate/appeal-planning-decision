const { VIEW } = require('../lib/views');
const getAppealSideBarDetails = require('../lib/appeal-sidebar-details');
const { getTaskStatus } = require('../services/task.service');
const { createOrUpdateAppealReply } = require('../lib/appeal-reply-api-wrapper');

const sectionName = 'optionalDocumentsSection';
const taskName = 'developmentOrNeighbourhood';

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

exports.postDevelopmentPlan = async (req, res) => {
  const {
    body,
    session: { appealReply },
  } = req;
  const { errors = {}, errorSummary = [] } = body;

  const values = {
    'has-plan-submitted': body['has-plan-submitted'],
    'plan-changes-text': body['plan-changes-text'],
  };

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.DEVELOPMENT_PLAN, {
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
      errors,
      errorSummary,
      values,
    });
    return;
  }

  const task = appealReply[sectionName][taskName];
  task.hasPlanSubmitted = body['has-plan-submitted'] === 'yes';
  task.planChanges = body['has-plan-submitted'] === 'yes' ? body['plan-changes-text'] : '';
  appealReply.sectionStates[sectionName][taskName] = getTaskStatus(
    appealReply,
    sectionName,
    taskName
  );

  try {
    req.session.appealReply = await createOrUpdateAppealReply(appealReply);
  } catch (err) {
    req.log.error({ err }, 'Error creating or updating appeal');

    res.render(VIEW.DEVELOPMENT_PLAN, {
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
      errors,
      errorSummary: [{ text: err.toString() }],
      values,
    });

    return;
  }

  res.redirect(req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`);
};
