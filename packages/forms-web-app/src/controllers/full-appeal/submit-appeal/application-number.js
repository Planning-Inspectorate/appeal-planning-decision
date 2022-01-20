const {
  VIEW: {
    FULL_APPEAL: { APPLICATION_NUMBER, DESIGN_ACCESS_STATEMENT_SUBMITTED },
  },
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const { getTaskStatus } = require('../../../services/task.service');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = 'applicationNumber';

exports.getApplicationNumber = (req, res) => {
  const { applicationNumber } = req.session.appeal.planningApplicationDocumentsSection;
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
      planningApplicationDocumentsSection: { applicationNumber },
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
    appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
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

  res.redirect(`/${DESIGN_ACCESS_STATEMENT_SUBMITTED}`);
};
