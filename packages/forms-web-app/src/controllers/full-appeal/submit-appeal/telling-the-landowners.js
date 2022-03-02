const {
  VIEW: {
    FULL_APPEAL: { TELLING_THE_LANDOWNERS, AGRICULTURAL_HOLDING },
  },
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const { getTaskStatus } = require('../../../services/task.service');
const toArray = require('../../../lib/to-array');

const sectionName = 'appealSiteSection';
const taskName = 'tellingTheLandowners';

const buildVariables = (knowsTheOwners, ownsSomeOfTheLand, tellingTheLandowners) => {
  return {
    knowsTheOwners,
    ownsSomeOfTheLand,
    tellingTheLandowners: toArray(tellingTheLandowners),
  };
};

const getTellingTheLandowners = (req, res) => {
  const {
    appeal: {
      appealSiteSection: {
        siteOwnership: { knowsTheOwners, ownsSomeOfTheLand, tellingTheLandowners },
      },
    },
  } = req.session;

  res.render(
    TELLING_THE_LANDOWNERS,
    buildVariables(knowsTheOwners, ownsSomeOfTheLand, tellingTheLandowners)
  );
};

const postTellingTheLandowners = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: {
      appeal,
      appeal: {
        appealSiteSection: {
          siteOwnership: { knowsTheOwners, ownsSomeOfTheLand },
        },
      },
    },
  } = req;

  const tellingTheLandowners = toArray(body['telling-the-landowners']);

  if (Object.keys(errors).length > 0) {
    return res.render(TELLING_THE_LANDOWNERS, {
      ...buildVariables(knowsTheOwners, ownsSomeOfTheLand, tellingTheLandowners),
      errors,
      errorSummary,
    });
  }

  try {
    appeal.appealSiteSection.siteOwnership.tellingTheLandowners = tellingTheLandowners;
    appeal.sectionStates[sectionName].siteOwnership[taskName] = getTaskStatus(
      appeal,
      sectionName,
      taskName
    );
    req.session.appeal = await createOrUpdateAppeal(appeal);

    return res.redirect(`/${AGRICULTURAL_HOLDING}`);
  } catch (err) {
    logger.error(err);

    return res.render(TELLING_THE_LANDOWNERS, {
      ...buildVariables(knowsTheOwners, ownsSomeOfTheLand, tellingTheLandowners),
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }
};

module.exports = {
  getTellingTheLandowners,
  postTellingTheLandowners,
};
