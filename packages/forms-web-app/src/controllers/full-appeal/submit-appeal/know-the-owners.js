const {
  constants: {
    KNOW_THE_OWNERS: {
      YES: KNOW_THE_OWNERS_YES,
      NO: KNOW_THE_OWNERS_NO,
      SOME: KNOW_THE_OWNERS_SOME,
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
const { getTaskStatus } = require('../../../services/task.service');

const sectionName = 'appealSiteSection';
const taskName = 'knowsTheOwners';

const getKnowTheOwners = (req, res) => {
  const {
    appeal: { [sectionName]: { ownsSomeOfTheLand, [taskName]: knowsTheOwners } = {} },
  } = req.session;
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
      appeal: { [sectionName]: { ownsSomeOfTheLand } = {} },
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
      knowTheOwnersSomeNo.includes(appeal[sectionName]?.knowsTheOwners) &&
      knowsTheOwners !== appeal[sectionName]?.knowsTheOwners
    ) {
      appeal[sectionName].identifyingTheOwners = null;
    }
    appeal[sectionName] = appeal[sectionName] || {};
    appeal[sectionName][taskName] = knowsTheOwners;
    appeal.sectionStates[sectionName] = appeal.sectionStates[sectionName] || {};
    appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
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
