const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');

exports.getSiteLocation = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.SITE_LOCATION, {
    appeal: req.session.appeal,
  });
};

exports.postSiteLocation = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  const appeal = {
    ...req.session.appeal,
    'site-address-line-one': req.body['site-address-line-one'],
    'site-address-line-two': req.body['site-address-line-two'],
    'site-town-city': req.body['site-town-city'],
    'site-county': req.body['site-county'],
    'site-postcode': req.body['site-postcode'],
  };

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.APPELLANT_SUBMISSION.SITE_LOCATION, {
      appeal,
      errors,
      errorSummary,
    });
    return;
  }

  try {
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);
    res.render(VIEW.APPELLANT_SUBMISSION.SITE_LOCATION, {
      appeal,
      errors,
      errorSummary: {
        a: 'b',
      },
    });
    return;
  }

  res.redirect(`/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP}`);
};
