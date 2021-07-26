const { VIEW } = require('../lib/views');
const getAppealSideBarDetails = require('../lib/appeal-sidebar-details');
const { getTaskStatus } = require('../services/task.service');
const { createOrUpdateAppealReply } = require('../lib/appeal-reply-api-wrapper');

const sectionName = 'aboutSiteSection';
const taskName = 'healthSafety';

exports.getHealthSafety = (req, res) => {
  const healthSafetySection = req.session.appealReply.healthSafety;

  let { hasHealthSafety } = healthSafetySection;

  if (typeof hasHealthSafety === 'boolean') {
    hasHealthSafety = hasHealthSafety ? 'yes' : 'no';
  }

  const values = {
    'has-health-safety': hasHealthSafety,
    'health-safety-text': healthSafetySection.healthSafetyIssues,
  };

  res.render(VIEW.HEALTH_SAFETY, {
    appeal: getAppealSideBarDetails(req.session.appeal),
    backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
    values,
  });
};

exports.postHealthSafety = async (req, res) => {
  const {
    body,
    session: { appealReply },
  } = req;
  const { errors = {}, errorSummary = [] } = body;

  const values = {
    'has-health-safety': body['has-health-safety'],
    'health-safety-text': body['health-safety-text'],
  };

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.HEALTH_SAFETY, {
      appeal: getAppealSideBarDetails(req.session.appeal),
      backLink: req.session.backLink || `/${req.params.id}/${VIEW.TASK_LIST}`,
      errors,
      errorSummary,
      values,
    });
    return;
  }

  const task = appealReply[taskName];

  task.hasHealthSafety = body['has-health-safety'] === 'yes';
  task.healthSafetyIssues = body['has-health-safety'] === 'yes' ? body['health-safety-text'] : '';
  appealReply.sectionStates[taskName] = getTaskStatus(appealReply, sectionName, taskName);

  try {
    req.session.appealReply = await createOrUpdateAppealReply(appealReply);
  } catch (err) {
    req.log.error({ err }, 'Error creating or updating appeal');

    res.render(VIEW.HEALTH_SAFETY, {
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
