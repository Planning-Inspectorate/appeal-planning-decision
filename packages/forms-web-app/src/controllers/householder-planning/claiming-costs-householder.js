const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');

const { VIEW } = require('../../lib/views');

const claimingCosts = VIEW.HOUSEHOLDER_PLANNING.CLAIMING_COSTS_HOUSEHOLDER;
const nextPage = '/appeal-householder-decision/check-your-answers'; // To change when confirmed
const backLink = `/${VIEW.HOUSEHOLDER_PLANNING.ENFORCEMENT_NOTICE_HOUSEHOLDER}`;
const shutterPage = `/${VIEW.FULL_PLANNING.USE_A_DIFFERENT_SERVICE}`;

exports.getClaimingCostsHouseholder = async (req, res) => {
  // RE-POPULATE ENTRY
  res.render(claimingCosts, { backLink });
};

const redirect = (selection, res) => {
  if (selection === 'yes') {
    res.redirect(shutterPage);
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
    res.render(claimingCosts, {
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

  if (!errors['claiming-costs-householder']) {
    try {
      req.session.appeal = await createOrUpdateAppeal(appeal);
      redirect(selection, res);
    } catch (e) {
      logger.error(e);

      res.render(claimingCosts, {
        appeal,
        errors,
        errorSummary: [{ text: e.toString(), href: 'pageId' }],
        backLink,
      });
    }
  }
};
