const { storePdfAppeal } = require('../../services/pdf.service');

const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');

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
    try {
      const { appeal } = req.session;
      appeal.state = 'SUBMITTED';
      req.session.appeal = await createOrUpdateAppeal(appeal);
      await storePdfAppeal(appeal);
    } catch (e) {
      req.log.error(e);
      res.render(VIEW.APPELLANT_SUBMISSION.SUBMISSION, {
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
