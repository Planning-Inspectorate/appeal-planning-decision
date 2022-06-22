const {
  VIEW: {
    FULL_APPEAL: { PLANNING_APPLICATION_NUMBER, EMAIL_ADDRESS },
  },
} = require('../../../lib/full-appeal/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const logger = require('../../../lib/logger');
const backLink = '/before-you-start/can-use-service';

exports.getPlanningApplicationNumber = (req, res) => {
  const { planningApplicationNumber } = req.session.appeal;
  res.render(PLANNING_APPLICATION_NUMBER, {
    planningApplicationNumber,
    backLink,
  });
};

exports.postPlanningApplicationNumber = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  const { appeal } = req.session;
  const { planningApplicationNumber } = appeal;

  if (Object.keys(errors).length > 0) {
    return res.render(PLANNING_APPLICATION_NUMBER, {
      planningApplicationNumber,
      backLink,
      errors,
      errorSummary,
    });
  }

  try {
    appeal.planningApplicationNumber = body['application-number'];
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);
    res.render(PLANNING_APPLICATION_NUMBER, {
      planningApplicationNumber,
      backLink,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
    });
    return;
  }

  res.redirect(`/${EMAIL_ADDRESS}`);
};
