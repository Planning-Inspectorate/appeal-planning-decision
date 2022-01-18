const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { DESIGN_ACCESS_STATEMENT, DESIGN_ACCESS_STATEMENT_SUBMITTED, DECISION_LETTER },
  },
} = require('../../../lib/full-appeal/views');
const { getTaskStatus } = require('../../../services/task.service');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = 'isDesignAccessStatementSubmitted';

const getDesignAccessStatementSubmitted = (req, res) => {
  const {
    appeal: { [sectionName]: { [taskName]: isDesignAccessStatementSubmitted } = {} },
  } = req.session;
  res.render(DESIGN_ACCESS_STATEMENT_SUBMITTED, {
    isDesignAccessStatementSubmitted,
  });
};

const postDesignAccessStatementSubmitted = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(DESIGN_ACCESS_STATEMENT_SUBMITTED, {
      errors,
      errorSummary,
    });
  }

  const isDesignAccessStatementSubmitted = body['design-access-statement-submitted'] === 'yes';

  try {
    appeal[sectionName] = appeal[sectionName] || {};
    appeal[sectionName][taskName] = isDesignAccessStatementSubmitted;
    appeal.sectionStates[sectionName] = appeal.sectionStates[sectionName] || {};
    appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(DESIGN_ACCESS_STATEMENT_SUBMITTED, {
      isDesignAccessStatementSubmitted,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return isDesignAccessStatementSubmitted
    ? res.redirect(`/${DESIGN_ACCESS_STATEMENT}`)
    : res.redirect(`/${DECISION_LETTER}`);
};

module.exports = {
  getDesignAccessStatementSubmitted,
  postDesignAccessStatementSubmitted,
};
