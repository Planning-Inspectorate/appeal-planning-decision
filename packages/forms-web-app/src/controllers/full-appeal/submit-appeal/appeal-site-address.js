const {
  VIEW: {
    FULL_APPEAL: { APPEAL_SITE_ADDRESS: currentPage, OWN_ALL_THE_LAND },
  },
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

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
    req.session.appeal.sectionStates[sectionName][taskName] = COMPLETED;
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

  res.redirect(`/${OWN_ALL_THE_LAND}`);
};
