const {
  constants: {
    PROCEDURE_TYPE: { HEARING, INQUIRY },
  },
} = require('@pins/business-rules');
const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { HOW_DECIDE_APPEAL, TASK_LIST, WHY_HEARING, WHY_INQUIRY },
  },
} = require('../../../lib/full-appeal/views');
// const { getTaskStatus } = require('../../../services/task.service');
const { NOT_STARTED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDecisionSection';
const taskName = 'procedureType';

const getHowDecideAppeal = (req, res) => {
  const { procedureType } = req.session.appeal[sectionName];
  res.render(HOW_DECIDE_APPEAL, {
    procedureType,
  });
};

const postHowDecideAppeal = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(HOW_DECIDE_APPEAL, {
      errors,
      errorSummary,
    });
  }

  const procedureType = body['procedure-type'];

  try {
    appeal[sectionName][taskName] = procedureType;
    // appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    appeal.sectionStates[sectionName][taskName] = NOT_STARTED;

    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(HOW_DECIDE_APPEAL, {
      procedureType,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  switch (procedureType) {
    case HEARING:
      return res.redirect(`/${WHY_HEARING}`);
    case INQUIRY:
      return res.redirect(`/${WHY_INQUIRY}`);
    default:
      return res.redirect(`/${TASK_LIST}`);
  }
};

module.exports = {
  getHowDecideAppeal,
  postHowDecideAppeal,
};
