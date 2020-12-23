const logger = require('../../lib/logger');
const { getTaskStatus } = require('../../services/task.service');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');

const sectionName = 'aboutYouSection';
const taskName = 'yourDetails';

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

  const { appeal } = req.session;
  const task = appeal[sectionName][taskName];

  switch (body['are-you-the-original-appellant']) {
    case 'yes': {
      task.isOriginalApplicant = true;
      break;
    }
    case 'no': {
      task.isOriginalApplicant = false;
      break;
    }
    default: {
      task.isOriginalApplicant = undefined;
      break;
    }
  }

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
    appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);

    res.render(VIEW.APPELLANT_SUBMISSION.WHO_ARE_YOU, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
      FORM_FIELD,
    });
    return;
  }

  res.redirect(`/${VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS}`);
};
