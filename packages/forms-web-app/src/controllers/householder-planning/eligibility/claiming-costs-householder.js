const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');

const {
  VIEW: {
    HOUSEHOLDER_PLANNING: {
      ELIGIBILITY: { CLAIMING_COSTS: claimingCosts },
    },
  },
} = require('../../../lib/householder-planning/views');

const backLink = `/before-you-start/enforcement-notice-householder`;
const nextPage = `/appellant-submission/task-list`;

exports.getClaimingCostsHouseholder = async (req, res) => {
  res.render(claimingCosts, { backLink });
};

const redirect = (selection, res) => {
  if (selection === 'yes') {
    res.redirect(`/before-you-start/use-a-different-service`);
    return;
  }

  res.redirect(nextPage);
};

exports.postClaimingCostsHouseholder = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  const selection = body['claiming-costs-householder'];

  if (errors['claiming-costs-householder']) {
    return res.render(claimingCosts, {
      appeal,
      errors,
      errorSummary,
      backLink,
    });
  }

  appeal.eligibility = {
    ...appeal.eligibility,
    isClaimingCosts: selection === 'yes',
  };

  try {
    req.session.appeal = await createOrUpdateAppeal(appeal);
    return redirect(selection, res);
  } catch (e) {
    logger.error(e);

    return res.render(claimingCosts, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: 'pageId' }],
      backLink,
    });
  }
};
