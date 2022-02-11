const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { AGRICULTURAL_HOLDING, ARE_YOU_A_TENANT, VISIBLE_FROM_ROAD },
  },
} = require('../../../lib/full-appeal/views');
// const { getTaskStatus } = require('../../../services/task.service');
const { NOT_STARTED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealSiteSection';
const taskName = 'agriculturalHolding';

const getAgriculturalHolding = (req, res) => {
  const { isAgriculturalHolding } = req.session.appeal[sectionName][taskName];
  res.render(AGRICULTURAL_HOLDING, {
    isAgriculturalHolding,
  });
};

const postAgriculturalHolding = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(AGRICULTURAL_HOLDING, {
      errors,
      errorSummary,
    });
  }

  const isAgriculturalHolding = body['agricultural-holding'] === 'yes';

  try {
    appeal[sectionName][taskName].isAgriculturalHolding = isAgriculturalHolding;
    // appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    appeal.sectionStates[sectionName][taskName] = NOT_STARTED;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(AGRICULTURAL_HOLDING, {
      isAgriculturalHolding,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return isAgriculturalHolding
    ? res.redirect(`/${ARE_YOU_A_TENANT}`)
    : res.redirect(`/${VISIBLE_FROM_ROAD}`);
};

module.exports = {
  getAgriculturalHolding,
  postAgriculturalHolding,
};
