const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { DESIGN_ACCESS_STATEMENT, DESIGN_ACCESS_STATEMENT_SUBMITTED, DECISION_LETTER },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = 'designAccessStatement';

const getDesignAccessStatementSubmitted = (req, res) => {
  const {
    appeal: {
      [sectionName]: {
        [taskName]: { isSubmitted },
      },
    },
  } = req.session;
  res.render(DESIGN_ACCESS_STATEMENT_SUBMITTED, {
    isSubmitted,
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

  const isSubmitted = body['design-access-statement-submitted'] === 'yes';

  try {
    appeal[sectionName][taskName].isSubmitted = isSubmitted;
    appeal.sectionStates[sectionName].designAccessStatementSubmitted = COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(DESIGN_ACCESS_STATEMENT_SUBMITTED, {
      isSubmitted,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return isSubmitted
    ? res.redirect(`/${DESIGN_ACCESS_STATEMENT}`)
    : res.redirect(`/${DECISION_LETTER}`);
};

module.exports = {
  getDesignAccessStatementSubmitted,
  postDesignAccessStatementSubmitted,
};
