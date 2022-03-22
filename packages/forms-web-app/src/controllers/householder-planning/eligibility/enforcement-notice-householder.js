const {
  constants: { APPEAL_ID, APPLICATION_DECISION },
} = require('@pins/business-rules');
const logger = require('../../../lib/logger');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  VIEW: {
    HOUSEHOLDER_PLANNING: {
      ELIGIBILITY: { ENFORCEMENT_NOTICE_HOUSEHOLDER: currentPage },
    },
  },
} = require('../../../lib/householder-planning/views');
const {
  validEnforcementNoticeHouseholderOptions,
} = require('../../../validators/householder-planning/eligibility/enforcement-notice-householder');

const navigationPages = {
  nextPage: '/before-you-start/claiming-costs-householder',
  shutterPage: '/before-you-start/use-a-different-service',
};

const decisionDateEnforcementNoticeMapper = (key) => {
  const pages = {
    [`${APPEAL_ID.HOUSEHOLDER}_${APPLICATION_DECISION.GRANTED}`]:
      '/before-you-start/decision-date-householder',
    [`${APPEAL_ID.HOUSEHOLDER}_${APPLICATION_DECISION.REFUSED}`]:
      '/before-you-start/decision-date-householder',
    [`${APPEAL_ID.HOUSEHOLDER}_${APPLICATION_DECISION.NODECISIONRECEIVED}`]:
      '/before-you-start/date-decision-due-householder',
  };

  return pages[key];
};

const getPreviousPagePath = (appealType, applicationDecision) => {
  return decisionDateEnforcementNoticeMapper(`${appealType}_${applicationDecision}`);
};

exports.getEnforcementNoticeHouseholder = (req, res) => {
  const { appeal } = req.session;

  navigationPages.previousPage = getPreviousPagePath(
    appeal.appealType,
    appeal.eligibility?.applicationDecision
  );
  res.render(currentPage, {
    enforcementNotice: appeal.eligibility.enforcementNotice,
    previousPage: navigationPages.previousPage,
  });
};

exports.postEnforcementNoticeHouseholder = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  navigationPages.previousPage = getPreviousPagePath(
    appeal.appealType,
    appeal.eligibility?.applicationDecision
  );

  let hasReceivedEnforcementNoticeHouseholder = null;
  if (validEnforcementNoticeHouseholderOptions.includes(req.body['enforcement-notice'])) {
    hasReceivedEnforcementNoticeHouseholder = req.body['enforcement-notice'] === 'yes';
  }

  if (Object.keys(errors).length > 0) {
    res.render(currentPage, {
      enforcementNotice: appeal.eligibility.enforcementNotice,
      errors,
      errorSummary,
      previousPage: navigationPages.previousPage,
    });
    return;
  }

  appeal.eligibility.enforcementNotice = hasReceivedEnforcementNoticeHouseholder;
  try {
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);

    res.render(currentPage, {
      enforcementNotice: appeal.eligibility.enforcementNotice,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
      previousPage: navigationPages.previousPage,
    });
    return;
  }

  if (hasReceivedEnforcementNoticeHouseholder) {
    res.redirect(navigationPages.shutterPage);
    return;
  }

  res.redirect(navigationPages.nextPage);
};
