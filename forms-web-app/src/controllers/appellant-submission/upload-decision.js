const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');

exports.getUploadDecision = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION, {
    appeal: req.session.appeal,
  });
};

exports.postUploadDecision = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION, {
      appeal: req.session.appeal || {},
      errors,
      errorSummary,
    });
    return;
  }

  const appeal = {
    ...req.session.appeal,
    'decision-upload': req.files &&
      req.files['decision-upload'] && {
        fileName: req.files['decision-upload'].name,
      },
  };

  try {
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);
    res.render(VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION, {
      appeal,
      errors,
      errorSummary: {
        a: 'b',
      },
    });
    return;
  }

  res.redirect(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);
};
