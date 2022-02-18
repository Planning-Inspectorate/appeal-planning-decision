const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const {
  VIEW: {
    FULL_APPEAL: { CONTACT_DETAILS, TASK_LIST },
  },
} = require('../../../lib/full-appeal/views');
const TASK_STATUS = require('../../../services/task-status/task-statuses');

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
    res.render(CONTACT_DETAILS, {
      appeal,
      errors,
      errorSummary,
    });
    return;
  }

  try {
    appeal.sectionStates[sectionName][taskName] = TASK_STATUS.COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);
    res.render(CONTACT_DETAILS, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }
  res.redirect(`/${TASK_LIST}`);
};
