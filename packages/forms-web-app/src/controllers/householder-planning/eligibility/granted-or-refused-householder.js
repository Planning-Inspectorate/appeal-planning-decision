const {
  constants: { APPEAL_ID },
} = require('@pins/business-rules');
const logger = require('../../../lib/logger');
const {
  VIEW: {
    HOUSEHOLDER_PLANNING: {
      ELIGIBILITY: { GRANTED_OR_REFUSED_HOUSEHOLDER },
    },
  },
} = require('../../../lib/householder-planning/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');

const {
  HOUSEHOLDER_PLANNING: {
    PLANNING_APPLICATION_STATUS: { GRANTED, REFUSED },
  },
} = require('../../../constants');

const getGrantedOrRefusedHouseholder = async (req, res) => {
  res.render(GRANTED_OR_REFUSED_HOUSEHOLDER, {
    appeal: req.session.appeal,
  });
};

const postGrantedOrRefusedHouseholder = async (req, res) => {
  const { body } = req;
  const { appeal } = req.session;
  const { errors = {}, errorSummary = [] } = body;

  const applicationDecision = body['granted-or-refused'];

  if (Object.keys(errors).length > 0) {
    return res.render(GRANTED_OR_REFUSED_HOUSEHOLDER, {
      appeal,
      errors,
      errorSummary,
    });
  }

  try {
    appeal.eligibility.applicationDecision = applicationDecision;
    appeal.appealType =
      applicationDecision === REFUSED ? APPEAL_ID.HOUSEHOLDER : APPEAL_ID.PLANNING_SECTION_78;
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (err) {
    logger.error(err);

    return res.render(GRANTED_OR_REFUSED_HOUSEHOLDER, {
      appeal,
      errors,
      errorSummary: [{ text: err.toString(), href: '#' }],
    });
  }

  switch (applicationDecision) {
    case GRANTED:
      return res.redirect('/before-you-start/decision-date');
    case REFUSED:
      return res.redirect('/before-you-start/decision-date-householder');
    default:
      return res.redirect('/before-you-start/date-decision-due');
  }
};

module.exports = {
  getGrantedOrRefusedHouseholder,
  postGrantedOrRefusedHouseholder,
};
