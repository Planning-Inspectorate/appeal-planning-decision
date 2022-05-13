const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { PLANS_DRAWINGS_DOCUMENTS, PROPOSED_DEVELOPMENT_CHANGED },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'planningApplicationDocumentsSection';
const taskName = 'proposedDevelopmentChanged';

const getProposedDevelopmentChanged = (req, res) => {
  const { proposedDevelopmentChanged } = req.session.appeal[sectionName];
  res.render(PROPOSED_DEVELOPMENT_CHANGED, {
    proposedDevelopmentChanged,
  });
};

const postProposedDevelopmentChanged = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const {
    appeal,
  } = req.session;

  const proposedDevelopmentChanged = {
    isProposedDevelopmentChanged:
      body['proposed-development-changed'] && body['proposed-development-changed'] === 'yes',
    details: body['proposed-development-changed-details'],
  };

  if (Object.keys(errors).length > 0) {
    return res.render(PROPOSED_DEVELOPMENT_CHANGED, {
      proposedDevelopmentChanged,
      errors,
      errorSummary,
    });
  }

  try {
    appeal.sectionStates[sectionName][taskName] = COMPLETED;
    appeal[sectionName][taskName] = proposedDevelopmentChanged;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(PROPOSED_DEVELOPMENT_CHANGED, {
      proposedDevelopmentChanged,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${PLANS_DRAWINGS_DOCUMENTS}`);
};

module.exports = {
  getProposedDevelopmentChanged,
  postProposedDevelopmentChanged,
};
