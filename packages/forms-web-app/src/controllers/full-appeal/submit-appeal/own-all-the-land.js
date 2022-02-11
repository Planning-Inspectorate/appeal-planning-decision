const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { AGRICULTURAL_HOLDING, OWN_ALL_THE_LAND, OWN_SOME_OF_THE_LAND },
  },
} = require('../../../lib/full-appeal/views');
const { getTaskStatus } = require('../../../services/task.service');

const sectionName = 'appealSiteSection';
const taskName = 'siteOwnership';

const getOwnAllTheLand = (req, res) => {
  const { ownsAllTheLand } = req.session.appeal[sectionName][taskName];
  res.render(OWN_ALL_THE_LAND, {
    ownsAllTheLand,
  });
};

const postOwnAllTheLand = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(OWN_ALL_THE_LAND, {
      errors,
      errorSummary,
    });
  }

  const ownsAllTheLand = body['own-all-the-land'] === 'yes';

  try {
    appeal[sectionName][taskName].ownsAllTheLand = ownsAllTheLand;
    appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(OWN_ALL_THE_LAND, {
      ownsAllTheLand,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return ownsAllTheLand
    ? res.redirect(`/${AGRICULTURAL_HOLDING}`)
    : res.redirect(`/${OWN_SOME_OF_THE_LAND}`);
};

module.exports = {
  getOwnAllTheLand,
  postOwnAllTheLand,
};
