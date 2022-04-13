const {
  constants: { APPEAL_ID, APPLICATION_DECISION },
} = require('@pins/business-rules');
const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
  VIEW: {
    FULL_APPEAL: { ENFORCEMENT_NOTICE: currentPage },
  },
} = require('../../lib/views');
const {
  validEnforcementNoticeOptions,
} = require('../../validators/full-appeal/enforcement-notice');

const navigationPages = {
  nextPage: '/full-appeal/submit-appeal/task-list',
  shutterPage: '/before-you-start/use-existing-service-enforcement-notice',
};

const decisionDateEnforcementNoticeMapper = (key) => {
  const pages = {
    [`${APPEAL_ID.PLANNING_SECTION_78}_${APPLICATION_DECISION.GRANTED}`]:
      '/before-you-start/decision-date',
    [`${APPEAL_ID.PLANNING_SECTION_78}_${APPLICATION_DECISION.REFUSED}`]:
      '/before-you-start/decision-date',
    [`${APPEAL_ID.PLANNING_SECTION_78}_${APPLICATION_DECISION.NODECISIONRECEIVED}`]:
      '/before-you-start/date-decision-due',
  };

  return pages[key];
};

const getPreviousPagePath = (appealType, applicationDecision) => {
  return decisionDateEnforcementNoticeMapper(`${appealType}_${applicationDecision}`);
};

exports.getEnforcementNotice = (req, res) => {
  const { appeal } = req.session;

  navigationPages.previousPage = getPreviousPagePath(
    appeal.appealType,
    appeal.eligibility.applicationDecision
  );
  res.render(currentPage, {
    appeal,
    previousPage: navigationPages.previousPage,
  });
};

exports.postEnforcementNotice = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;
  const { appeal } = req.session;

  navigationPages.previousPage = getPreviousPagePath(
    appeal.appealType,
    appeal.eligibility.applicationDecision
  );

  let hasReceivedEnforcementNotice = null;
  if (validEnforcementNoticeOptions.includes(req.body['enforcement-notice'])) {
    hasReceivedEnforcementNotice = req.body['enforcement-notice'] === 'yes';
  }

  if (Object.keys(errors).length > 0) {
    res.render(currentPage, {
      appeal: {
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          enforcementNotice: hasReceivedEnforcementNotice,
        },
      },
      errors,
      errorSummary,
      previousPage: navigationPages.previousPage,
    });
    return;
  }

  try {
    req.session.appeal = await createOrUpdateAppeal({
      ...appeal,
      eligibility: {
        ...appeal.eligibility,
        enforcementNotice: hasReceivedEnforcementNotice,
      },
    });
  } catch (e) {
    logger.error(e);

    res.render(currentPage, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
      previousPage: navigationPages.previousPage,
    });
    return;
  }

  if (hasReceivedEnforcementNotice) {
    res.redirect(navigationPages.shutterPage);
    return;
  }

  res.redirect(navigationPages.nextPage);
};
