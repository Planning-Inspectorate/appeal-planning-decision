const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { HEALTH_SAFETY_ISSUES, TASK_LIST },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'appealSiteSection';
const taskName = 'healthAndSafety';

const getHealthSafetyIssues = (req, res) => {
  const { healthAndSafety } = req.session.appeal[sectionName];
  res.render(HEALTH_SAFETY_ISSUES, {
    healthAndSafety,
  });
};

const postHealthSafetyIssues = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;

  const healthAndSafety = {
    hasIssues: body['health-safety-issues'] && body['health-safety-issues'] === 'yes',
    details: body['health-safety-issues-details'],
  };

  if (Object.keys(errors).length > 0) {
    return res.render(HEALTH_SAFETY_ISSUES, {
      healthAndSafety,
      errors,
      errorSummary,
    });
  }

  try {
    if (req.body['save-and-return'] !== '') {
      appeal[sectionName][taskName] = healthAndSafety;
      appeal.sectionStates[sectionName][taskName] = COMPLETED;
      req.session.appeal = await createOrUpdateAppeal(appeal);
      return res.redirect(`/${TASK_LIST}`);
    }
    appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
    req.session.appeal = await createOrUpdateAppeal(appeal);
    return await postSaveAndReturn(req, res, appeal);
  } catch (err) {
    logger.error(err);

    return res.render(HEALTH_SAFETY_ISSUES, {
      healthAndSafety,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }
};

module.exports = {
  getHealthSafetyIssues,
  postHealthSafetyIssues,
};
