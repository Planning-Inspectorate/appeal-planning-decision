const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');

exports.getAppealStatement = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT, {
    appeal: req.session.appeal,
  });
};

exports.postAppealStatement = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  const appeal = {
    ...req.session.appeal,
    'appeal-upload':
      req.files &&
      req.files['appeal-upload'] &&
      JSON.stringify({
        name: req.files['appeal-upload'].name,
      }),
  };

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT, {
      appeal,
      errors,
      errorSummary,
    });
    return;
  }

  if (body['does-not-include-sensitive-information'] === 'i-confirm') {
    try {
      req.session.appeal = await createOrUpdateAppeal(appeal);
    } catch (e) {
      logger.error(e);
      res.render(VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT, {
        appeal,
        errors,
        errorSummary: {
          a: 'b',
        },
      });
      return;
    }

    res.redirect(`/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`);
    return;
  }

  res.redirect(`/${VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT}`);
};
