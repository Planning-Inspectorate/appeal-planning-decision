const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { PLANS_DRAWINGS_DOCUMENTS, PROPOSED_DEVELOPMENT_CHANGED },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealSiteSection';
const taskName = 'proposedDevelopmentChanged';

const getProposedDevelopmentChanged = (req, res) => {
  const {
    appeal: {
      [sectionName]: {
        proposedDevelopmentChanged,
      },
    },
  } = req.session;
  res.render(PROPOSED_DEVELOPMENT_CHANGED, {
    proposedDevelopmentChanged,
  });
};

const postProposedDevelopmentChanged = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;

  const isProposedDevelopmentChanged = {
    isVisible:
      body['proposed-development-changed'] && body['proposed-development-changed'] === 'yes',
    details: body['proposed-development-changed-details'],
  };

  if (Object.keys(errors).length > 0) {
    return res.render(PROPOSED_DEVELOPMENT_CHANGED, {
      isProposedDevelopmentChanged,
      errors,
      errorSummary,
    });
  }

  try {
    appeal[sectionName][taskName] = isProposedDevelopmentChanged;
    appeal.sectionStates[sectionName][taskName] = COMPLETED;

    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(PROPOSED_DEVELOPMENT_CHANGED, {
      isProposedDevelopmentChanged,
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
