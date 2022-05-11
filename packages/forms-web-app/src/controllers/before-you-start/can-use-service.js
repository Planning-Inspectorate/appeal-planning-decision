const { extractAppealProps } = require('../../lib/extract-appeal-props');
const { calculateDeadline } = require('../../lib/calculate-deadline');
const {
  VIEW: {
    HOUSEHOLDER_PLANNING: {
      ELIGIBILITY: {
        CAN_USE_SERVICE_HOUSEHOLDER: canUseServiceHouseholder,
        CAN_USE_SERVICE_PRIOR_APPROVAL: canUseServicePriorApprovalHouseholder,
        CAN_USE_SERVICE_REMOVAL_OR_VARIATION_OF_CONDITIONS:
          canUseServiceRemovalOrVariationOfConditionsHouseholder,
      },
    },
  },
} = require('../../lib/householder-planning/views');
const {
  VIEW: {
    FULL_APPEAL: {
      CAN_USE_SERVICE_FULL_APPEAL: canUseServiceFullAppealUrl,
      CAN_USE_SERVICE_PRIOR_APPROVAL: canUseServicePriorApprovalFull,
      CAN_USE_SERVICE_REMOVAL_OR_VARIATION_OF_CONDITIONS:
        canUseServiceRemovalOrVariationOfConditionsFullAppeal,
    },
  },
} = require('../../lib/full-appeal/views');

const canUseServiceHouseholderPlanning = async (req, res) => {
  const { appeal } = req.session;

  const {
    appealLPD,
    applicationType,
    applicationDecision,
    decisionDate,
    enforcementNotice,
    dateOfDecisionLabel,
  } = await extractAppealProps(appeal);

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
    dateOfDecisionLabel,
  });
};

const canUseServiceFullAppeal = async (req, res) => {
  const { appeal } = req.session;
  const {
    appealLPD,
    applicationType,
    applicationDecision,
    decisionDate,
    enforcementNotice,
    dateOfDecisionLabel,
  } = await extractAppealProps(appeal);

  const deadlineDate = calculateDeadline.fullAppealApplication(appeal.decisionDate);

  res.render(canUseServiceFullAppealUrl, {
    deadlineDate,
    appealLPD,
    applicationType,
    applicationDecision,
    decisionDate,
    enforcementNotice,
    dateOfDecisionLabel,
  });
};

const canUseServicePriorApproval = async (req, res) => {
  const { appeal } = req.session;
  const {
    appealLPD,
    applicationType,
    applicationDecision,
    decisionDate,
    enforcementNotice,
    dateOfDecisionLabel,
  } = await extractAppealProps(appeal);

  const hasPriorApprovalForExistingHome = appeal.eligibility.hasPriorApprovalForExistingHome
    ? 'Yes'
    : 'No';

  if (appeal.eligibility.hasPriorApprovalForExistingHome) {
    const isListedBuilding = appeal.eligibility.isListedBuilding ? 'Yes' : 'No';

    const deadlineDate = calculateDeadline.householderApplication(appeal.decisionDate);

    const claimingCosts = appeal.eligibility.isClaimingCosts ? 'Yes' : 'No';

    res.render(canUseServicePriorApprovalHouseholder, {
      deadlineDate,
      appealLPD,
      applicationType,
      isListedBuilding,
      applicationDecision,
      decisionDate,
      enforcementNotice,
      claimingCosts,
      dateOfDecisionLabel,
      hasPriorApprovalForExistingHome,
    });
  } else {
    const deadlineDate = calculateDeadline.fullAppealApplication(appeal.decisionDate);

    res.render(canUseServicePriorApprovalFull, {
      deadlineDate,
      appealLPD,
      applicationType,
      applicationDecision,
      decisionDate,
      enforcementNotice,
      dateOfDecisionLabel,
      hasPriorApprovalForExistingHome,
    });
  }
};

const canUseServiceRemovalOrVariationOfConditions = async (req, res) => {
  const { appeal } = req.session;
  const {
    appealLPD,
    applicationType,
    applicationDecision,
    decisionDate,
    enforcementNotice,
    dateOfDecisionLabel,
  } = await extractAppealProps(appeal);

  const hasHouseholderPermissionConditions = appeal.eligibility.hasHouseholderPermissionConditions
    ? 'Yes'
    : 'No';

  if (appeal.eligibility.hasHouseholderPermissionConditions) {
    const isListedBuilding = appeal.eligibility.isListedBuilding ? 'Yes' : 'No';

    const deadlineDate = calculateDeadline.householderApplication(appeal.decisionDate);

    const claimingCosts = appeal.eligibility.isClaimingCosts ? 'Yes' : 'No';

    res.render(canUseServiceRemovalOrVariationOfConditionsHouseholder, {
      deadlineDate,
      appealLPD,
      applicationType,
      isListedBuilding,
      applicationDecision,
      decisionDate,
      enforcementNotice,
      claimingCosts,
      dateOfDecisionLabel,
      hasHouseholderPermissionConditions,
    });
  } else {
    const deadlineDate = calculateDeadline.fullAppealApplication(appeal.decisionDate);

    res.render(canUseServiceRemovalOrVariationOfConditionsFullAppeal, {
      deadlineDate,
      appealLPD,
      applicationType,
      applicationDecision,
      decisionDate,
      enforcementNotice,
      dateOfDecisionLabel,
      hasHouseholderPermissionConditions,
    });
  }
};

exports.getCanUseService = async (req, res) => {
  const { appeal } = req.session;
  const applicationType = appeal.typeOfPlanningApplication;

  switch (applicationType) {
    case 'full-appeal':
    case 'outline-planning':
    case 'reserved-matters':
      await canUseServiceFullAppeal(req, res);
      break;
    case 'prior-approval':
      await canUseServicePriorApproval(req, res);
      break;
    case 'removal-or-variation-of-conditions':
      await canUseServiceRemovalOrVariationOfConditions(req, res);
      break;
    default:
      await canUseServiceHouseholderPlanning(req, res);
  }
};
