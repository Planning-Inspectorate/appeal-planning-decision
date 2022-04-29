const { format, parseISO } = require('date-fns');
const { getDepartmentFromId } = require('../../../services/department.service');
const { capitalise } = require('../../../lib/capitalised-dashed-strings');
const { calculateDeadline } = require('../../../lib/calculate-deadline');
const {
  VIEW: {
    HOUSEHOLDER_PLANNING: {
      ELIGIBILITY: { CAN_USE_SERVICE: canUseServiceHouseholderPlanningUrl },
    },
  },
} = require('../../../lib/householder-planning/views');
const {
  VIEW: {
    FULL_APPEAL: { CAN_USE_SERVICE: canUseServiceFullAppealUrl },
  },
} = require('../../../lib/full-appeal/views');

const canUseServiceHouseholderPlanning = async (req, res) => {
  const { appeal } = req.session;
  let appealLPD = '';

  if (appeal.lpaCode) {
    const lpd = await getDepartmentFromId(appeal.lpaCode);
    if (lpd) {
      appealLPD = lpd.name;
    }
  }

  let applicationType;

  if (appeal.typeOfPlanningApplication) {
    applicationType = appeal.typeOfPlanningApplication;
    applicationType = capitalise(applicationType);
  }

  const isListedBuilding = appeal.eligibility.isListedBuilding ? 'Yes' : 'No';

  let { applicationDecision } = appeal.eligibility;
  applicationDecision = capitalise(applicationDecision);

  const deadlineDate = calculateDeadline.householderApplication(appeal.decisionDate);

  const decisionDate = format(parseISO(appeal.decisionDate), 'dd MMMM yyyy');

  const enforcementNotice = appeal.eligibility.enforcementNotice ? 'Yes' : 'No';

  const claimingCosts = appeal.eligibility.isClaimingCosts ? 'Yes' : 'No';

  res.render(canUseServiceHouseholderPlanningUrl, {
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
  let appealLPD = '';

  if (appeal.lpaCode) {
    const lpd = await getDepartmentFromId(appeal.lpaCode);
    if (lpd) {
      appealLPD = lpd.name;
    }
  }

  let applicationType;

  if (appeal.typeOfPlanningApplication) {
    applicationType = appeal.typeOfPlanningApplication;
    applicationType = capitalise(applicationType);
  }

  const isListedBuilding = appeal.eligibility.isListedBuilding ? 'Yes' : 'No';

  let { applicationDecision } = appeal.eligibility;
  applicationDecision = capitalise(applicationDecision);

  const deadlineDate = calculateDeadline.householderApplication(appeal.decisionDate);

  const decisionDate = format(parseISO(appeal.decisionDate), 'dd MMMM yyyy');

  const enforcementNotice = appeal.eligibility.enforcementNotice ? 'Yes' : 'No';

  const claimingCosts = appeal.eligibility.isClaimingCosts ? 'Yes' : 'No';

  res.render(canUseServiceFullAppealUrl, {
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

exports.getCanUseService = async (req, res) => {
  const applicationType = req.session.appeal.typeOfPlanningApplication;
  if (applicationType === 'householder-planning') {
    await canUseServiceHouseholderPlanning(req, res);
  } else if (applicationType === 'full-appeal') {
    await canUseServiceFullAppeal(req, res);
  }
};
