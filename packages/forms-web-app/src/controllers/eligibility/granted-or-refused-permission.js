const logger = require('../../lib/logger');
const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
  validHouseholderPlanningPermissionStatusOptions,
} = require('../../validators/eligibility/granted-or-refused-permission');

const { ELIGIBILITY } = require('../../constants');

exports.getNoDecision = async (req, res) => {
  res.render(VIEW.ELIGIBILITY.NO_DECISION);
};

exports.getGrantedOrRefusedPermissionOut = async (req, res) => {
  res.render(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION_OUT);
};

exports.getGrantedOrRefusedPermission = async (req, res) => {
  res.render(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION, {
    appeal: req.session.appeal,
  });
};

const forwardPage = (permissionStatus) => {
  const status = {
    [ELIGIBILITY.PLANNING_PERMISSION_STATUS.GRANTED]: VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION_OUT,
    [ELIGIBILITY.PLANNING_PERMISSION_STATUS.REFUSED]: VIEW.ELIGIBILITY.DECISION_DATE,
    [ELIGIBILITY.PLANNING_PERMISSION_STATUS.NODECISION]: VIEW.ELIGIBILITY.NO_DECISION,
    default: VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION,
  };

  return status[permissionStatus] || status.default;
};

exports.forwardPage = forwardPage;

exports.postGrantedOrRefusedPermission = async (req, res) => {
  const { body } = req;
  const { appeal } = req.session;
  const { errors = {}, errorSummary = [] } = body;

  const planningPermissionStatus = body['granted-or-refused-permission'];
  let selectedPermissionStatus = null;

  if (validHouseholderPlanningPermissionStatusOptions.includes(planningPermissionStatus)) {
    selectedPermissionStatus = planningPermissionStatus.toLowerCase();
  }

  if (Object.keys(errors).length > 0) {
    res.render(forwardPage('default'), {
      appeal: {
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          planningPermissionStatus: selectedPermissionStatus,
        },
      },
      errors,
      errorSummary,
    });
    return;
  }

  let isPlanningPermissionRefused = null;

  if(validHouseholderPlanningPermissionStatusOptions.includes(planningPermissionStatus)){
    isPlanningPermissionRefused = planningPermissionStatus.toLowerCase() === 'refused';
  }
  
  try {
    req.session.appeal = await createOrUpdateAppeal({
      ...appeal,
      eligibility: {
        ...appeal.eligibility,
        planningPermissionStatus: selectedPermissionStatus,
      },
    });
  } catch (e) {
    logger.error(e);

    res.render(forwardPage('default'), {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }
  
  if(!isPlanningPermissionRefused){
    res.redirect(`/${VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION_OUT}`);
    return;
  }

  res.redirect(`/${forwardPage(selectedPermissionStatus)}`);
};
