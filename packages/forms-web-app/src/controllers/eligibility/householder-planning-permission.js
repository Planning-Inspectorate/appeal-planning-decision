const logger = require('../../lib/logger');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const { VIEW } = require('../../lib/views');
const {
  validHouseholderPlanningPermissionOptions,
} = require('../../validators/eligibility/householder-planning-permission');

exports.getServiceOnlyForHouseholderPlanningPermission = (req, res) => {
  res.render(VIEW.ELIGIBILITY.HOUSEHOLDER_PLANNING_PERMISSION_OUT);
};

exports.getHouseholderPlanningPermission = (req, res) => {
  res.render(VIEW.ELIGIBILITY.HOUSEHOLDER_PLANNING_PERMISSION, {
    appeal: req.session.appeal,
  });
};

exports.postHouseholderPlanningPermission = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  const { appeal } = req.session;

  let didApplyForHouseholderPlanningPermission = null;
  if (
    validHouseholderPlanningPermissionOptions.includes(req.body['householder-planning-permission'])
  ) {
    didApplyForHouseholderPlanningPermission =
      req.body['householder-planning-permission'] === 'yes';
  }

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.ELIGIBILITY.HOUSEHOLDER_PLANNING_PERMISSION, {
      appeal: {
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          householderPlanningPermission: didApplyForHouseholderPlanningPermission,
        },
      },
      errors,
      errorSummary,
    });
    return;
  }

  try {
    req.session.appeal = await createOrUpdateAppeal({
      ...appeal,
      eligibility: {
        ...appeal.eligibility,
        householderPlanningPermission: didApplyForHouseholderPlanningPermission,
      },
    });
  } catch (e) {
    logger.error(e);

    res.render(VIEW.ELIGIBILITY.HOUSEHOLDER_PLANNING_PERMISSION, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  if (didApplyForHouseholderPlanningPermission === false) {
    res.redirect(`/${VIEW.ELIGIBILITY.HOUSEHOLDER_PLANNING_PERMISSION_OUT}`);
    return;
  }

  res.redirect(`/${VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION}`);
};
