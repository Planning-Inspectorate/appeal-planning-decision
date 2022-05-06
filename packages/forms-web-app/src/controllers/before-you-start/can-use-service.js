const { extractAppealProps } = require('../../lib/extract-appeal-props');
const { calculateDeadline } = require('../../lib/calculate-deadline');
const {
  VIEW: {
    HOUSEHOLDER_PLANNING: {
      ELIGIBILITY: { CAN_USE_SERVICE_HOUSEHOLDER: canUseServiceHouseholder },
    },
  },
} = require('../../lib/householder-planning/views');
const {
  VIEW: {
    FULL_APPEAL: { CAN_USE_SERVICE_FULL_APPEAL: canUseServiceFullAppealUrl },
  },
} = require('../../lib/full-appeal/views');

const canUseServiceHouseholderPlanning = async (req, res) => {
  const { appeal } = req.session;

  const { appealLPD, applicationType, applicationDecision, decisionDate, enforcementNotice } =
    await extractAppealProps(appeal);

  const isListedBuilding = appeal.eligibility.isListedBuilding ? 'Yes' : 'No';

  const deadlineDate = calculateDeadline.householderApplication(appeal.decisionDate);

  const claimingCosts = appeal.eligibility.isClaimingCosts ? 'Yes' : 'No';

  res.render(canUseServiceHouseholder, {
    deadlineDate,
    appealLPD,
    applicationType,
    isListedBuilding,
    applicationDecision,
    decisionDate,
    enforcementNotice,
    claimingCosts,
  });
};

const canUseServiceFullAppeal = async (req, res) => {
  const { appeal } = req.session;
  const { appealLPD, applicationType, applicationDecision, decisionDate, enforcementNotice } =
    await extractAppealProps(appeal);

  const deadlineDate = calculateDeadline.fullAppealApplication(appeal.decisionDate);

  res.render(canUseServiceFullAppealUrl, {
    deadlineDate,
    appealLPD,
    applicationType,
    applicationDecision,
    decisionDate,
    enforcementNotice,
  });
};

exports.getCanUseService = async (req, res) => {
  const { appeal } = req.session;
  const applicationType = appeal.typeOfPlanningApplication;
  if (
    applicationType === 'householder-planning' ||
    appeal.eligibility.hasHouseholderPermissionConditions
  ) {
    await canUseServiceHouseholderPlanning(req, res);
  } else {
    await canUseServiceFullAppeal(req, res);
  }
};
