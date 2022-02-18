const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { APPLICANT_NAME: currentPage, CONTACT_DETAILS },
  },
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');
// const { getTaskStatus, FULL_APPEAL_SECTIONS } = require('../../../services/task.service');
const { NOT_STARTED } = require('../../../services/task-status/task-statuses');

const sectionName = 'contactDetailsSection';
const taskName = 'appealingOnBehalfOf';

exports.getApplicantName = (req, res) => {
  res.render(currentPage, {
    appeal: req.session.appeal,
  });
};

exports.postApplicantName = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  const { appeal } = req.session;
  const task = appeal[sectionName][taskName];

  task.name = req.body['behalf-appellant-name'];
  task.companyName = req.body['company-name'];

  if (Object.keys(errors).length > 0) {
    res.render(currentPage, {
      appeal,
      errors,
      errorSummary,
    });
    return;
  }

  try {
    // appeal.sectionStates[sectionName][taskName] = getTaskStatus(
    //   appeal,
    //   sectionName,
    //   taskName,
    //   FULL_APPEAL_SECTIONS
    // );
    appeal.sectionStates[sectionName][taskName] = NOT_STARTED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);
    res.render(currentPage, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  res.redirect(`/${CONTACT_DETAILS}`);
};
