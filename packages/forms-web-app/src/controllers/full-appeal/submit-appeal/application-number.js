const {
  VIEW: {
    FULL_APPEAL: { APPLICATION_NUMBER, PROPOSED_DEVELOPMENT_CHANGED },
  },
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = 'applicationNumber';

exports.getApplicationNumber = (req, res) => {
  const { applicationNumber } = req.session.appeal[sectionName];
  res.render(APPLICATION_NUMBER, {
    applicationNumber,
  });
};

exports.postApplicationNumber = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  const {
    appeal,
    appeal: {
      [sectionName]: { applicationNumber },
    },
  } = req.session;
  const task = appeal[sectionName];

  task.applicationNumber = body['application-number'];

  if (Object.keys(errors).length > 0) {
    res.render(APPLICATION_NUMBER, {
      applicationNumber,
      errors,
      errorSummary,
    });
    return;
  }

  try {
    appeal.sectionStates[sectionName][taskName] = COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);
    res.render(APPLICATION_NUMBER, {
      applicationNumber,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  res.redirect(`/${PROPOSED_DEVELOPMENT_CHANGED}`);
};
