const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { DRAFT_STATEMENT_COMMON_GROUND, WHY_HEARING },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealDecisionSection';
const taskName = 'hearing';

const getWhyHearing = (req, res) => {
  const { reason } = req.session.appeal[sectionName][taskName];
  res.render(WHY_HEARING, {
    reason,
  });
};

const postWhyHearing = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;

  const reason = body['why-hearing'];

  if (Object.keys(errors).length > 0) {
    return res.render(WHY_HEARING, {
      reason,
      errors,
      errorSummary,
    });
  }

  try {
    appeal[sectionName][taskName].reason = reason;
    appeal.sectionStates[sectionName][taskName] = COMPLETED;

    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(WHY_HEARING, {
      reason,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${DRAFT_STATEMENT_COMMON_GROUND}`);
};

module.exports = {
  getWhyHearing,
  postWhyHearing,
};
