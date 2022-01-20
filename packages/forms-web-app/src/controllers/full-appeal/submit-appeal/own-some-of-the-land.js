const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { OWN_SOME_OF_THE_LAND, KNOW_THE_OWNERS },
  },
} = require('../../../lib/full-appeal/views');
const { getTaskStatus } = require('../../../services/task.service');

const sectionName = 'appealSiteSection';
const taskName = 'ownsSomeOfTheLand';

const getOwnSomeOfTheLand = (req, res) => {
  const {
    appeal: { [sectionName]: { [taskName]: ownsSomeOfTheLand } = {} },
  } = req.session;
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
    appeal[sectionName] = appeal[sectionName] || {};
    appeal[sectionName][taskName] = ownsSomeOfTheLand;
    appeal.sectionStates[sectionName] = appeal.sectionStates[sectionName] || {};
    appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
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
