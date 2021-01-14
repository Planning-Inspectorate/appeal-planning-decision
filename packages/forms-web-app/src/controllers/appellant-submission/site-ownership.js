const logger = require('../../lib/logger');
const { getNextTask, getTaskStatus } = require('../../services/task.service');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const {
  validSiteOwnershipOptions,
} = require('../../validators/appellant-submission/site-ownership');

const sectionName = 'appealSiteSection';
const taskName = 'siteOwnership';

exports.getSiteOwnership = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP, {
    appeal: req.session.appeal,
  });
};

exports.postSiteOwnership = async (req, res) => {
  const { body } = req;

  const { errors = {}, errorSummary = [] } = body;

  const { appeal } = req.session;
  const task = appeal[sectionName][taskName];

  let ownsWholeSite = null;
  if (validSiteOwnershipOptions.includes(req.body['site-ownership'])) {
    ownsWholeSite = req.body['site-ownership'] === 'yes';
  }
  task.ownsWholeSite = ownsWholeSite;
  // if ownsWholeSite is true then haveOtherOwnersBeenTold needs to be null
  task.haveOtherOwnersBeenTold = ownsWholeSite ? null : task.haveOtherOwnersBeenTold;

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP, {
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

    res.render(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  if (!task.ownsWholeSite) {
    res.redirect(`/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP_CERTB}`);
    return;
  }

  res.redirect(getNextTask(appeal, { sectionName, taskName }).href);
};
