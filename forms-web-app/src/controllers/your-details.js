const { createOrUpdateAppeal } = require('../lib/appeals-api-wrapper');
const logger = require('../lib/logger');
const { VIEW } = require('../lib/views');

exports.getYourDetails = (req, res) => {
  res.render(VIEW.YOUR_DETAILS, {
    appeal: req.session.appeal,
  });
};

exports.postYourDetails = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  const appeal = {
    ...req.session.appeal,
    'appellant-name': req.body['appellant-name'],
    'appellant-email': req.body['appellant-email'],
  };

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.YOUR_DETAILS, {
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
    res.render(VIEW.YOUR_DETAILS, {
      appeal,
      errors,
      errorSummary: {
        a: 'b',
      },
    });
    return;
  }

  res.redirect(`/${VIEW.TASK_LIST}`);
};
