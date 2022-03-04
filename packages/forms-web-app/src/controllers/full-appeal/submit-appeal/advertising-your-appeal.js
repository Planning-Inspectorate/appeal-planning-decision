const { KNOW_THE_OWNERS } = require('@pins/business-rules/src/constants');
const {
  VIEW: {
    FULL_APPEAL: {
      ADVERTISING_YOUR_APPEAL,
      IDENTIFYING_THE_OWNERS,
      TELLING_THE_LANDOWNERS,
      AGRICULTURAL_HOLDING,
    },
  },
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const { COMPLETED } = require('../../../services/task-status/task-statuses');
const toArray = require('../../../lib/to-array');

const sectionName = 'appealSiteSection';
const taskName = 'advertisingYourAppeal';

const buildVariables = (ownsSomeOfTheLand, knowsTheOwners, advertisingYourAppeal) => {
  const isOther = ownsSomeOfTheLand;
  const isAll = knowsTheOwners === KNOW_THE_OWNERS.SOME;
  return {
    advertisingYourAppeal: toArray(advertisingYourAppeal),
    isOther,
    isAll,
    backLink: `/${IDENTIFYING_THE_OWNERS}`,
  };
};

const getAdvertisingYourAppeal = (req, res) => {
  const {
    appeal: {
      appealSiteSection: {
        siteOwnership: { ownsSomeOfTheLand, knowsTheOwners, advertisingYourAppeal },
      },
    },
  } = req.session;

  res.render(
    ADVERTISING_YOUR_APPEAL,
    buildVariables(ownsSomeOfTheLand, knowsTheOwners, advertisingYourAppeal)
  );
};

const postAdvertisingYourAppeal = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: {
      appeal,
      appeal: {
        appealSiteSection: {
          siteOwnership: { ownsSomeOfTheLand, knowsTheOwners },
        },
      },
    },
  } = req;

  const advertisingYourAppeal = toArray(body['advertising-your-appeal']);
  const variables = buildVariables(ownsSomeOfTheLand, knowsTheOwners, advertisingYourAppeal);
  if (Object.keys(errors).length > 0) {
    return res.render(ADVERTISING_YOUR_APPEAL, {
      ...variables,
      errors,
      errorSummary,
    });
  }

  try {
    appeal.appealSiteSection.siteOwnership.advertisingYourAppeal = advertisingYourAppeal;
    appeal.sectionStates[sectionName][taskName] = COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);

    const nextPage = variables.isAll ? `/${TELLING_THE_LANDOWNERS}` : `/${AGRICULTURAL_HOLDING}`;

    return res.redirect(nextPage);
  } catch (err) {
    logger.error(err);

    return res.render(ADVERTISING_YOUR_APPEAL, {
      ...variables,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }
};

module.exports = {
  getAdvertisingYourAppeal,
  postAdvertisingYourAppeal,
};
