const { I_AGREE } = require('@pins/business-rules/src/constants');
const {
  VIEW: {
    FULL_APPEAL: { IDENTIFYING_THE_OWNERS, ADVERTISING_YOUR_APPEAL },
  },
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealSiteSection';
const taskName = 'siteOwnership';

const buildVariables = (ownsSomeOfTheLand, knowsTheOwners, hasIdentifiedTheOwners) => {
  return {
    ownsSomeOfTheLand,
    knowsTheOwners,
    hasIdentifiedTheOwners,
    backLink: '/full-appeal/submit-appeal/know-the-owners',
  };
};

const getIdentifyingTheOwners = (req, res) => {
  const { ownsSomeOfTheLand, knowsTheOwners, hasIdentifiedTheOwners } =
    req.session.appeal[sectionName][taskName];
  res.render(
    IDENTIFYING_THE_OWNERS,
    buildVariables(ownsSomeOfTheLand, knowsTheOwners, hasIdentifiedTheOwners)
  );
};

const postIdentifyingTheOwners = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: {
      appeal,
      appeal: {
        [sectionName]: {
          [taskName]: { ownsSomeOfTheLand, knowsTheOwners },
        },
      },
    },
  } = req;

  const hasIdentifiedTheOwner = body['identifying-the-owners'] === I_AGREE;
  const variables = buildVariables(ownsSomeOfTheLand, knowsTheOwners, hasIdentifiedTheOwner);
  if (Object.keys(errors).length > 0) {
    return res.render(IDENTIFYING_THE_OWNERS, {
      ...variables,
      errors,
      errorSummary,
    });
  }

  try {
    appeal[sectionName][taskName].hasIdentifiedTheOwners = hasIdentifiedTheOwner;
    appeal.sectionStates[sectionName].identifyingTheLandOwners = COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);

    return res.redirect(`/${ADVERTISING_YOUR_APPEAL}`);
  } catch (err) {
    logger.error(err);

    return res.render(IDENTIFYING_THE_OWNERS, {
      ...variables,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }
};

module.exports = {
  getIdentifyingTheOwners,
  postIdentifyingTheOwners,
};
