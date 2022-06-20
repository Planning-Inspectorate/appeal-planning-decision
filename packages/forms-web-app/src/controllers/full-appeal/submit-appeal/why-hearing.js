const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { DRAFT_STATEMENT_COMMON_GROUND, WHY_HEARING },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

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
    if (req.body['save-and-return'] !== '') {
      appeal.sectionStates[sectionName][taskName] = COMPLETED;
      req.session.appeal = await createOrUpdateAppeal(appeal);
      return res.redirect(`/${DRAFT_STATEMENT_COMMON_GROUND}`);
    }
    appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
    req.session.appeal = await createOrUpdateAppeal(appeal);
    return await postSaveAndReturn(req, res);
  } catch (err) {
    logger.error(err);

    return res.render(WHY_HEARING, {
      reason,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }
};

module.exports = {
  getWhyHearing,
  postWhyHearing,
};
