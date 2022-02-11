const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { OTHER_TENANTS, TELLING_THE_TENANTS, VISIBLE_FROM_ROAD },
  },
} = require('../../../lib/full-appeal/views');
// const { getTaskStatus } = require('../../../services/task.service');
const { NOT_STARTED } = require('../../../services/task-status/task-statuses');

const sectionName = 'appealSiteSection';
const taskName = 'agriculturalHolding';

const getOtherTenants = (req, res) => {
  const { hasOtherTenants } = req.session.appeal[sectionName][taskName];
  res.render(OTHER_TENANTS, {
    hasOtherTenants,
  });
};

const postOtherTenants = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: { appeal },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(OTHER_TENANTS, {
      errors,
      errorSummary,
    });
  }

  const hasOtherTenants = body['other-tenants'] === 'yes';

  try {
    appeal[sectionName][taskName].hasOtherTenants = hasOtherTenants;
    // appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    appeal.sectionStates[sectionName][taskName] = NOT_STARTED;

    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(OTHER_TENANTS, {
      hasOtherTenants,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  return hasOtherTenants
    ? res.redirect(`/${TELLING_THE_TENANTS}`)
    : res.redirect(`/${VISIBLE_FROM_ROAD}`);
};

module.exports = {
  getOtherTenants,
  postOtherTenants,
};
