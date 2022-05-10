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
  const {
    [sectionName]: {
      [taskName]: { isProposedDevelopmentChanged },
      siteOwnership: { ownsAllTheLand, knowsTheOwners },
    },
  } = req.session.appeal;
  res.render(PROPOSED_DEVELOPMENT_CHANGED, {
    isProposedDevelopmentChanged,
    ownsAllTheLand,
    knowsTheOwners,
  });
};

const postProposedDevelopmentChanged = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: {
      appeal,
      appeal: {
        [sectionName]: {
          siteOwnership: { ownsAllTheLand, knowsTheOwners },
        },
      },
    },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(PROPOSED_DEVELOPMENT_CHANGED, {
      ownsAllTheLand,
      knowsTheOwners,
      errors,
      errorSummary,
    });
  }

  const isProposedDevelopmentChanged = body['proposed-development-changed'] === 'yes';

  try {
    appeal[sectionName][taskName].isAgriculturalHolding = isProposedDevelopmentChanged;
    appeal.sectionStates[sectionName][taskName] = COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(PROPOSED_DEVELOPMENT_CHANGED, {
      isProposedDevelopmentChanged,
      ownsAllTheLand,
      knowsTheOwners,
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
