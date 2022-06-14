const logger = require('../../../lib/logger');
const { COMPLETED } = require('../../../services/task-status/task-statuses');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { ORIGINAL_APPLICANT: currentPage, APPLICANT_NAME, CONTACT_DETAILS },
  },
} = require('../../../lib/full-appeal/views');

const sectionName = 'contactDetailsSection';
const taskName = 'isOriginalApplicant';

const FORM_FIELD = {
  'original-application-your-name': {
    id: 'original-application-your-name',
    items: [
      {
        value: 'yes',
        text: 'Yes, the planning application was made in my name',
      },
      {
        value: 'no',
        text: "No, I'm acting on behalf of the applicant",
      },
    ],
  },
};

exports.FORM_FIELD = FORM_FIELD;

exports.getOriginalApplicant = (req, res) => {
  res.render(currentPage, {
    FORM_FIELD,
    appeal: req.session.appeal,
  });
};

exports.postOriginalApplicant = async (req, res) => {
  const { body } = req;

  const { errors = {}, errorSummary = [] } = body;

  const { appeal } = req.session;
  const section = appeal[sectionName];
  let nextPage = currentPage;

  switch (body['original-application-your-name']) {
    case 'yes': {
      section[taskName] = true;
      nextPage = CONTACT_DETAILS;
      break;
    }
    case 'no': {
      section[taskName] = false;
      nextPage = APPLICANT_NAME;
      break;
    }
    default: {
      section[taskName] = undefined;
      break;
    }
  }

  if (Object.keys(errors).length > 0) {
    res.render(nextPage, {
      appeal,
      errors,
      errorSummary,
      FORM_FIELD,
    });
    return;
  }

  try {
    appeal.sectionStates[sectionName][taskName] = COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);
    nextPage = currentPage;

    res.render(nextPage, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
      FORM_FIELD,
    });
    return;
  }

  res.redirect(`/${nextPage}`);
};
