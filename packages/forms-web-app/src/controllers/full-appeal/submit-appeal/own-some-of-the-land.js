const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { OWN_SOME_OF_THE_LAND, KNOW_THE_OWNERS },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

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
  appeal[sectionName][taskName].ownsSomeOfTheLand = ownsSomeOfTheLand;

  try {
    if (req.body['save-and-return'] !== '') {
      appeal.sectionStates[sectionName].someOfTheLand = COMPLETED;
      req.session.appeal = await createOrUpdateAppeal(appeal);
      return res.redirect(`/${KNOW_THE_OWNERS}`);
    }
    appeal.sectionStates[sectionName].someOfTheLand = IN_PROGRESS;
    req.session.appeal = await createOrUpdateAppeal(appeal);
    return await postSaveAndReturn(req, res);
  } catch (err) {
    logger.error(err);

    return res.render(OWN_SOME_OF_THE_LAND, {
      ownsSomeOfTheLand,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }
};

module.exports = {
  getOwnSomeOfTheLand,
  postOwnSomeOfTheLand,
};
