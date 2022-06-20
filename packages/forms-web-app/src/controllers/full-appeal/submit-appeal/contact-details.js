const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const {
  VIEW: {
    FULL_APPEAL: { CONTACT_DETAILS, TASK_LIST },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'contactDetailsSection';
const taskName = 'contact';

exports.getContactDetails = (req, res) => {
  res.render(CONTACT_DETAILS, {
    appeal: req.session.appeal,
  });
};

exports.postContactDetails = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  appeal[sectionName][taskName] = {
    name: req.body['appellant-name'],
    companyName: req.body['appellant-company-name'],
    email: req.body['appellant-email'],
  };

  if (Object.keys(errors).length > 0) {
    return res.render(CONTACT_DETAILS, {
      appeal,
      errors,
      errorSummary,
    });
  }

  try {
    if (req.body['save-and-return'] !== '') {
      appeal.sectionStates[sectionName][taskName] = COMPLETED;
      req.session.appeal = await createOrUpdateAppeal(appeal);
      return res.redirect(`/${TASK_LIST}`);
    }
    appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
    req.session.appeal = await createOrUpdateAppeal(appeal);
    return await postSaveAndReturn(req, res);
  } catch (e) {
    logger.error(e);
    return res.render(CONTACT_DETAILS, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
  }
};
