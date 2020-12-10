const logger = require('../../lib/logger');
const { getNextUncompletedTask } = require('../../services/task.service');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const { getTaskStatus } = require('../../services/task.service');

const sectionName = 'appealSiteSection';
const taskName = 'healthAndSafety';

exports.getSiteAccessSafety = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY, {
    appeal: req.session.appeal,
  });
};

exports.postSiteAccessSafety = async (req, res) => {
  const { body } = req;

  const { errors = {}, errorSummary = [] } = body;

  const { appeal } = req.session;
  const task = appeal[sectionName][taskName];

  task.hasIssues = req.body['site-access-safety'];
  task.healthAndSafetyIssues = req.body['site-access-safety-concerns'];

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY, {
      appeal,
      errors,
      errorSummary,
    });
    return;
  }

  try {
    appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);

    res.render(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  res.redirect(getNextUncompletedTask(appeal, { sectionName, taskName }).href);
};
