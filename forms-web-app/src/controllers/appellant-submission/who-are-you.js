const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');

const FORM_FIELD = {
  'are-you-the-original-appellant': {
    id: 'are-you-the-original-appellant',
    items: [
      {
        value: 'yes',
        text: 'Yes',
      },
      {
        value: 'no',
        text: 'No',
      },
    ],
  },
};

exports.FORM_FIELD = FORM_FIELD;

exports.getWhoAreYou = (req, res) => {
  res.render(VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU, {
    FORM_FIELD,
    appeal: req.session.appeal,
  });
};

exports.postWhoAreYou = async (req, res) => {
  const { body } = req;

  const { errors = {}, errorSummary = [] } = body;

  const isOriginalAppellant = body['are-you-the-original-appellant'] === 'yes';

  const appeal = {
    ...req.session.appeal,
    'original-appellant': isOriginalAppellant,
  };

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU, {
      appeal,
      errors,
      errorSummary,
      FORM_FIELD,
    });
    return;
  }

  try {
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);

    res.render(VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU, {
      appeal,
      errors,
      errorSummary: {
        a: 'b',
      },
    });
    return;
  }

  res.redirect(`/${VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS}`);
};
