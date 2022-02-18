const {
  VIEW: {
    FULL_APPEAL: { APPEAL_SITE_ADDRESS: currentPage },
  },
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const {
  getNextTask,
  getTaskStatus,
  FULL_APPEAL_SECTIONS,
} = require('../../../services/task.service');

const sectionName = 'appealSiteSection';
const taskName = 'siteAddress';

exports.getAppealSiteAddress = (req, res) => {
  res.render(currentPage, {
    appeal: req.session.appeal,
  });
};

exports.postAppealSiteAddress = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  req.session.appeal[sectionName][taskName] = {
    addressLine1: req.body['site-address-line-one'],
    addressLine2: req.body['site-address-line-two'],
    town: req.body['site-town-city'],
    county: req.body['site-county'],
    postcode: req.body['site-postcode'],
  };

  if (Object.keys(errors).length > 0) {
    res.render(currentPage, {
      appeal,
      errors,
      errorSummary,
    });
    return;
  }

  try {
    req.session.appeal.sectionStates[sectionName][taskName] = getTaskStatus(
      appeal,
      sectionName,
      taskName,
      FULL_APPEAL_SECTIONS
    );
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);
    res.render(currentPage, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  res.redirect(getNextTask(appeal, { sectionName, taskName }, FULL_APPEAL_SECTIONS).href);
};
