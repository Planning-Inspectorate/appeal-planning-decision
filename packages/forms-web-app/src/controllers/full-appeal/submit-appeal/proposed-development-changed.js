const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { PROPOSED_DEVELOPMENT_CHANGED, PLANS_DRAWINGS_DOCUMENTS },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealSiteSection';
const taskName = 'proposedDevelopmentChanged';

const getProposedDevelopmentChanged = (req, res) => {
  const { isProposedDevelopmentChanged } = req.session.appeal[sectionName];
  res.render(PROPOSED_DEVELOPMENT_CHANGED, {
    isProposedDevelopmentChanged,
  });
};

const postProposedDevelopmentChanged = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  const {
    appeal,
    appeal: {
      [sectionName]: { isProposedDevelopmentChanged },
    },
  } = req.session;
  const task = appeal[sectionName];

  task.isProposedDevelopmentChanged = body['proposed-development-changed'];

  if (Object.keys(errors).length > 0) {
    res.render(PROPOSED_DEVELOPMENT_CHANGED, {
      isProposedDevelopmentChanged,
      errors,
      errorSummary,
    });
    return;
  }

  try {
    appeal.sectionStates[sectionName][taskName] = COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    res.render(PROPOSED_DEVELOPMENT_CHANGED, {
      isProposedDevelopmentChanged,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
    return;
  }

  res.redirect(`/${PLANS_DRAWINGS_DOCUMENTS}`);
};

module.exports = {
  getProposedDevelopmentChanged,
  postProposedDevelopmentChanged,
};
