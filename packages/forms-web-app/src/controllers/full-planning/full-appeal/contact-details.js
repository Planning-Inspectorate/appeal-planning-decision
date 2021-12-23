const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const {
  VIEW: {
    FULL_APPEAL: { CONTACT_DETAILS },
  },
} = require('../../../lib/full-planning/views');
const TASK_STATUS = require('../../../services/task-status/task-statuses');

const sectionName = 'contactDetailsSection';

exports.getContactDetails = (req, res) => {
  req.session.appeal.appealType = '1005';
  res.render(CONTACT_DETAILS, {
    appeal: req.session.appeal,
  });
};

exports.postContactDetails = async (req, res) => {
  req.session.appeal.appealType = '1005';
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  const { appeal } = req.session;

  const section = appeal[sectionName];

  section.name = req.body['appellant-name'];
  section.companyName = req.body['appellant-company-name'];
  section.email = req.body['appellant-email'];

  if (Object.keys(errors).length > 0) {
    res.render(CONTACT_DETAILS, {
      appeal,
      errors,
      errorSummary,
    });
    return;
  }

  try {
    appeal.sectionStates[sectionName] = TASK_STATUS.COMPLETED;
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
  res.redirect(`/full-appeal/task-list`);
};
