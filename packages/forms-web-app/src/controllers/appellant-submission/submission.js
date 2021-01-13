const { VIEW } = require('../../lib/views');

exports.getSubmission = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.SUBMISSION);
};

exports.postSubmission = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.APPELLANT_SUBMISSION.SUBMISSION, {
      errors,
      errorSummary,
    });
    return;
  }

  if (body['appellant-confirmation'] === 'i-agree') {
    res.redirect(`/${VIEW.APPELLANT_SUBMISSION.CONFIRMATION}`);
    return;
  }

  res.redirect(`/${VIEW.APPELLANT_SUBMISSION.SUBMISSION}`);
};
