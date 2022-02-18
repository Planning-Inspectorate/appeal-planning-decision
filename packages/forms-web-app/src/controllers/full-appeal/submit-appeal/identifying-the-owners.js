const {
  VIEW: {
    FULL_APPEAL: { IDENTIFYING_THE_OWNERS, ADVERTISING_YOUR_APPEAL },
  },
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const { getTaskStatus } = require('../../../services/task.service');

const sectionName = 'appealSiteSection';
const taskName = 'siteOwnership';

const getIdentifyingTheOwners = (req, res) => {
  const { knowsTheOwners, hasIdentifiedTheOwners } = req.session.appeal[sectionName][taskName];
  res.render(IDENTIFYING_THE_OWNERS, {
    knowsTheOwners,
    hasIdentifiedTheOwners,
  });
};

const postIdentifyingTheOwners = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: {
      appeal,
      appeal: {
        [sectionName]: {
          [taskName]: { knowsTheOwners },
        },
      },
    },
  } = req;

  if (Object.keys(errors).length > 0) {
    return res.render(IDENTIFYING_THE_OWNERS, {
      knowsTheOwners,
      errors,
      errorSummary,
    });
  }

  try {
    appeal[sectionName][taskName].hasIdentifiedTheOwners = body['identifying-the-owners'];
    appeal.sectionStates[sectionName][taskName] = getTaskStatus(appeal, sectionName, taskName);
    req.session.appeal = await createOrUpdateAppeal(appeal);

    return res.redirect(`/${ADVERTISING_YOUR_APPEAL}`);
  } catch (err) {
    logger.error(err);

    return res.render(IDENTIFYING_THE_OWNERS, {
      knowsTheOwners,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }
};

module.exports = {
  getIdentifyingTheOwners,
  postIdentifyingTheOwners,
};
