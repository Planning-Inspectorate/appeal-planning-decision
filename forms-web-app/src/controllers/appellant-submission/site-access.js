const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const { getTaskStatus } = require('../../services/task.service');

const sectionName = 'appealSiteSection';
const taskName = 'siteAccess';

exports.getSiteAccess = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS, {
    appeal: req.session.appeal,
  });
};

exports.postSiteAccess = async (req, res) => {
  const { body } = req;

  const { errors = {}, errorSummary = [] } = body;

  const { appeal } = req.session;
  const task = appeal[sectionName][taskName];

  task.canInspectorSeeWholeSiteFromPublicRoad = req.body['site-access'] === 'yes';
  task.howIsSiteAccessRestricted = req.body['site-access-more-detail'];

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS, {
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

    res.render(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  res.redirect(`/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY}`);
};
