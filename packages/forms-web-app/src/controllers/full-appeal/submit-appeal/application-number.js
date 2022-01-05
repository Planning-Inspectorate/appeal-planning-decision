const {
  VIEW: {
    FULL_APPEAL: { APPLICATION_NUMBER },
  },
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const {
  getNextTask,
  getTaskStatus,
  FULL_APPEAL_SECTIONS,
} = require('../../../services/task.service');

const sectionName = 'requiredDocumentsSection';
const taskName = 'applicationNumber';

exports.getApplicationNumber = (req, res) => {
  res.render(APPLICATION_NUMBER, {
    appeal: req.session.appeal,
  });
};

exports.postApplicationNumber = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  const { appeal } = req.session;
  const task = appeal[sectionName];

  task.applicationNumber = body['application-number'];

  if (Object.keys(errors).length > 0) {
    res.render(APPLICATION_NUMBER, {
      appeal,
      errors,
      errorSummary,
    });
    return;
  }

  try {
    appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);
    res.render(APPLICATION_NUMBER, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  res.redirect(getNextTask(appeal, { sectionName, taskName }, FULL_APPEAL_SECTIONS).href);
};
