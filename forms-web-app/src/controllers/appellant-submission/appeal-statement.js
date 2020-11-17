const { VIEW } = require('../../lib/views');

exports.getGroundsOfAppeal = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION_APPEAL_STATEMENT);
};

exports.postSaveAppeal = (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = {} } = body;

  const privacySafetyConfirmed = body['privacy-safe'];

  if (privacySafetyConfirmed && Object.keys(errors).length === 0) {
    res.redirect(`/${VIEW.SUPPORTING_DOCUMENTS}`);
  } else {
    res.render(VIEW.APPELLANT_SUBMISSION_APPEAL_STATEMENT, { errors, errorSummary });
  }
};
