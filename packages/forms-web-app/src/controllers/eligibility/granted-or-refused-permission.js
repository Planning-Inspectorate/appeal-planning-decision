const logger = require('../../lib/logger');
const { VIEW } = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');

exports.getGrantedOrRefusedPermission = async (req, res) => {
  res.render(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION, {
    appeal: req.session.appeal,
  });
};

exports.postGrantedOrRefusedPermission = async (req, res) => {
  const { body } = req;
  const { appeal } = req.session;
  const { errors = {}, errorSummary = [] } = body;

  const planningPermissionStatus = body['granted-or-refused-permission'];

  if (Object.keys(errors).length > 0) {
    res.render(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION, {
      appeal: {
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          planningPermissionStatus,
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
        planningPermissionStatus,
      },
    });
  } catch (e) {
    logger.error(e);

    res.render(VIEW.ELIGIBILITY.GRANTED_REFUSED_PERMISSION, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  res.redirect(`/${VIEW.ELIGIBILITY.DECISION_DATE}`);
};
