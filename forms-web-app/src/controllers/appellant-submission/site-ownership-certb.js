const logger = require('../../lib/logger');
const { getNextUncompletedTask, getTaskStatus } = require('../../services/task.service');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');

const sectionName = 'appealSiteSection';
const taskName = 'siteOwnership';

exports.getSiteOwnershipCertB = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP_CERTB, {
    appeal: req.session.appeal,
  });
};

exports.postSiteOwnershipCertB = async (req, res) => {
  const { body } = req;

  const { errors = {}, errorSummary = [] } = body;

  const { appeal } = req.session;
  const task = appeal[sectionName][taskName];

  task.haveOtherOwnersBeenTold = req.body['have-other-owners-been-told'] === 'yes';

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP_CERTB, {
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

    res.render(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP_CERTB, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  res.redirect(getNextUncompletedTask(appeal, { sectionName, taskName }).href);
};
