const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const logger = require('../../lib/logger');

exports.getApplicantName = (req, res) => {
  res.render(VIEW.APPLICANT_NAME, {
    appeal: req.session.appeal,
  });
};

exports.postApplicantName = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  const appeal = {
    ...req.session.appeal,
    'behalf-appellant-name': req.body['behalf-appellant-name'],
  };

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.APPLICANT_NAME, {
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
