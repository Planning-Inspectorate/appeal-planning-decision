const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');

exports.getSubmission = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.SUBMISSION);
};

exports.postSubmission = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.APPELLANT_SUBMISSION.SUBMISSION, {
      errors,
      errorSummary,
    });
    return;
  }

  if (body['appellant-confirmation'] === 'i-agree') {
    try {
      req.session.appeal = await createOrUpdateAppeal(appeal);
    } catch (e) {
      logger.error(e);

      res.render(VIEW.APPELLANT_SUBMISSION.SUBMISSION, {
        appeal,
        errors,
        errorSummary: [{ text: e.toString(), href: '#' }],
      });
      return;
    }

    res.redirect(`/${VIEW.APPELLANT_SUBMISSION.CONFIRMATION}`);
    return;
  }

  res.redirect(`/${VIEW.APPELLANT_SUBMISSION.SUBMISSION}`);
};
