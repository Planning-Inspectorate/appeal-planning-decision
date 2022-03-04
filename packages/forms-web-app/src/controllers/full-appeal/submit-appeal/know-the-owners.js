const {
  constants: {
    KNOW_THE_OWNERS: {
      NO: KNOW_THE_OWNERS_NO,
      SOME: KNOW_THE_OWNERS_SOME,
      YES: KNOW_THE_OWNERS_YES,
    },
  },
} = require('@pins/business-rules');
const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { IDENTIFYING_THE_OWNERS, KNOW_THE_OWNERS, TELLING_THE_LANDOWNERS },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealSiteSection';
const taskName = 'siteOwnership';

const getKnowTheOwners = (req, res) => {
  const { ownsSomeOfTheLand, knowsTheOwners } = req.session.appeal[sectionName][taskName];
  res.render(KNOW_THE_OWNERS, {
    ownsSomeOfTheLand,
    knowsTheOwners,
  });
};

const postKnowTheOwners = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: {
      appeal,
      appeal: {
        [sectionName]: {
          [taskName]: { ownsSomeOfTheLand },
        },
      },
    },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(KNOW_THE_OWNERS, {
      ownsSomeOfTheLand,
      errors,
      errorSummary,
    });
  }

  const knowsTheOwners = body['know-the-owners'];
  const knowTheOwnersSomeNo = [KNOW_THE_OWNERS_SOME, KNOW_THE_OWNERS_NO];

  try {
    if (
      knowTheOwnersSomeNo.includes(knowsTheOwners) &&
      knowTheOwnersSomeNo.includes(appeal[sectionName][taskName].knowsTheOwners) &&
      knowsTheOwners !== appeal[sectionName][taskName].knowsTheOwners
    ) {
      appeal[sectionName][taskName].hasIdentifiedTheOwners = null;
    }
    appeal[sectionName][taskName].knowsTheOwners = knowsTheOwners;
    appeal.sectionStates[sectionName].knowTheOwners = COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(KNOW_THE_OWNERS, {
      ownsSomeOfTheLand,
      knowsTheOwners,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return knowsTheOwners === KNOW_THE_OWNERS_YES
    ? res.redirect(`/${TELLING_THE_LANDOWNERS}`)
    : res.redirect(`/${IDENTIFYING_THE_OWNERS}`);
};

module.exports = {
  getKnowTheOwners,
  postKnowTheOwners,
};
