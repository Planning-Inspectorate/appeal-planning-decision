const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { HEALTH_SAFETY_ISSUES, TASK_LIST },
  },
} = require('../../../lib/full-appeal/views');
const { getTaskStatus } = require('../../../services/task.service');

const sectionName = 'appealSiteSection';
const hasHealthSafetyIssuesTask = 'hasHealthSafetyIssues';
const healthSafetyIssuesDetailsTask = 'healthSafetyIssuesDetails';

const getHealthSafetyIssues = (req, res) => {
  const {
    appeal: { [sectionName]: { hasHealthSafetyIssues, healthSafetyIssuesDetails } = {} },
  } = req.session;
  res.render(HEALTH_SAFETY_ISSUES, {
    hasHealthSafetyIssues,
    healthSafetyIssuesDetails,
  });
};

const postHealthSafetyIssues = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;

  const hasHealthSafetyIssues =
    body['health-safety-issues'] && body['health-safety-issues'] === 'yes';
  const healthSafetyIssuesDetails = body['health-safety-issues-details'];

  if (Object.keys(errors).length > 0) {
    return res.render(HEALTH_SAFETY_ISSUES, {
      hasHealthSafetyIssues,
      healthSafetyIssuesDetails,
      errors,
      errorSummary,
    });
  }

  try {
    appeal[sectionName] = appeal[sectionName] || {};
    appeal[sectionName][hasHealthSafetyIssuesTask] = hasHealthSafetyIssues;
    appeal[sectionName][healthSafetyIssuesDetailsTask] = healthSafetyIssuesDetails;
    appeal.sectionStates[sectionName] = appeal.sectionStates[sectionName] || {};
    appeal.sectionStates[sectionName].hasHealthSafetyIssues = getTaskStatus(
      appeal,
      sectionName,
      hasHealthSafetyIssuesTask
    );
    appeal.sectionStates[sectionName].healthSafetyIssuesDetails = getTaskStatus(
      appeal,
      sectionName,
      healthSafetyIssuesDetailsTask
    );

    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(HEALTH_SAFETY_ISSUES, {
      hasHealthSafetyIssues,
      healthSafetyIssuesDetails,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${TASK_LIST}`);
};

module.exports = {
  getHealthSafetyIssues,
  postHealthSafetyIssues,
};
