const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { OWN_SOME_OF_THE_LAND, KNOW_THE_OWNERS },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealSiteSection';
const taskName = 'siteOwnership';

const getOwnSomeOfTheLand = (req, res) => {
  const { ownsSomeOfTheLand } = req.session.appeal[sectionName][taskName];
  res.render(OWN_SOME_OF_THE_LAND, {
    ownsSomeOfTheLand,
  });
};

const postOwnSomeOfTheLand = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(OWN_SOME_OF_THE_LAND, {
      errors,
      errorSummary,
    });
  }

  const ownsSomeOfTheLand = body['own-some-of-the-land'] === 'yes';

  try {
    appeal[sectionName][taskName].ownsSomeOfTheLand = ownsSomeOfTheLand;
    appeal.sectionStates[sectionName].someOfTheLand = COMPLETED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(OWN_SOME_OF_THE_LAND, {
      ownsSomeOfTheLand,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return res.redirect(`/${KNOW_THE_OWNERS}`);
};

module.exports = {
  getOwnSomeOfTheLand,
  postOwnSomeOfTheLand,
};
