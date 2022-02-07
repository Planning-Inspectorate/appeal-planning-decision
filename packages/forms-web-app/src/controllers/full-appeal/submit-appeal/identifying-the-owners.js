const {
  VIEW: {
    FULL_APPEAL: { IDENTIFYING_THE_OWNERS, ADVERTISING_YOUR_APPEAL },
  },
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const { getTaskStatus } = require('../../../services/task.service');

const sectionName = 'appealSiteSection';
const taskName = 'identifyingTheOwners';

const getIdentifyingTheOwners = (req, res) => {
  const {
    appeal: {
      appealSiteSection: { knowsTheOwners, identifyingTheOwners },
    },
  } = req.session;

  res.render(IDENTIFYING_THE_OWNERS, {
    knowsTheOwners,
    identifyingTheOwners,
  });
};

const postIdentifyingTheOwners = async (req, res) => {
  const {
    body,
    body: { errors = {}, errorSummary = [] },
    session: {
      appeal,
      appeal: {
        appealSiteSection: { knowsTheOwners },
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
    appeal.appealSiteSection.identifyingTheOwners = body['identifying-the-owners'];
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
