const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { AGRICULTURAL_HOLDING, ARE_YOU_A_TENANT, VISIBLE_FROM_ROAD },
  },
} = require('../../../lib/full-appeal/views');
const { COMPLETED, IN_PROGRESS } = require('../../../services/task-status/task-statuses');
const { postSaveAndReturn } = require('../../save');

const sectionName = 'appealSiteSection';
const taskName = 'agriculturalHolding';

const getAgriculturalHolding = (req, res) => {
  const {
    [sectionName]: {
      [taskName]: { isAgriculturalHolding },
      siteOwnership: { ownsAllTheLand, knowsTheOwners },
    },
  } = req.session.appeal;
  res.render(AGRICULTURAL_HOLDING, {
    isAgriculturalHolding,
    ownsAllTheLand,
    knowsTheOwners,
  });
};

const postAgriculturalHolding = async (req, res) => {
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
    return res.render(AGRICULTURAL_HOLDING, {
      ownsAllTheLand,
      knowsTheOwners,
      errors,
      errorSummary,
    });
  }

  const isAgriculturalHolding = body['agricultural-holding'] === 'yes';
  appeal[sectionName][taskName].isAgriculturalHolding = isAgriculturalHolding;

  try {
    if (req.body['save-and-return'] !== '') {
      appeal.sectionStates[sectionName][taskName] = COMPLETED;
      req.session.appeal = await createOrUpdateAppeal(appeal);
      return isAgriculturalHolding
        ? res.redirect(`/${ARE_YOU_A_TENANT}`)
        : res.redirect(`/${VISIBLE_FROM_ROAD}`);
    }
    req.session.appeal.sectionStates[sectionName][taskName] = IN_PROGRESS;
    req.session.appeal = await createOrUpdateAppeal(appeal);
    return await postSaveAndReturn(req, res);
  } catch (err) {
    logger.error(err);

    return res.render(AGRICULTURAL_HOLDING, {
      isAgriculturalHolding,
      ownsAllTheLand,
      knowsTheOwners,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }
};

module.exports = {
  getAgriculturalHolding,
  postAgriculturalHolding,
};
