const logger = require('../../../lib/logger');
const {
  VIEW: {
    HOUSEHOLDER_PLANNING: { ELIGIBILITY },
  },
} = require('../../../lib/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  validApplicationDecisionOptions,
} = require('../../../validators/householder-planning/eligibility/granted-or-refused');

const {
  HOUSEHOLDER_PLANNING: { PLANNING_APPLICATION_STATUS: applicationStatus },
} = require('../../../constants');

exports.forwardPage = (status) => {
  const statuses = {
    [applicationStatus.GRANTED]: '/before-you-start/decision-date-householder',
    [applicationStatus.NODECISION]: '/before-you-start/date-decision-due-householder',
    [applicationStatus.REFUSED]: '/before-you-start/decision-date-householder',
    previousPage: '/before-you-start/listed-building-householder',

    default: ELIGIBILITY.GRANTED_OR_REFUSED,
  };

  return statuses[status] || statuses.default;
};

exports.getGrantedOrRefused = async (req, res) => {
  res.render(ELIGIBILITY.GRANTED_OR_REFUSED, {
    appeal: req.session.appeal,
    previousPage: this.forwardPage('previousPage'),
  });
};

exports.postGrantedOrRefused = async (req, res) => {
  const { body } = req;
  const { appeal } = req.session;
  const { errors = {}, errorSummary = [] } = body;

  const applicationDecision = body['granted-or-refused'];
  let selectedApplicationStatus = null;

  if (validApplicationDecisionOptions.includes(applicationDecision)) {
    selectedApplicationStatus = applicationDecision.toLowerCase();
  }

  if (Object.keys(errors).length > 0) {
    res.render(this.forwardPage('default'), {
      appeal: {
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          applicationDecision: selectedApplicationStatus,
        },
      },
      errors,
      errorSummary,
      previousPage: this.forwardPage('previousPage'),
    });
    return;
  }

  try {
    req.session.appeal = await createOrUpdateAppeal({
      ...appeal,
      eligibility: {
        ...appeal.eligibility,
        applicationDecision: selectedApplicationStatus,
      },
      previousPage: this.forwardPage('previousPage'),
    });
  } catch (e) {
    logger.error(e);

    res.render(this.forwardPage('default'), {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
      previousPage: this.forwardPage('previousPage'),
    });
    return;
  }

  res.redirect(this.forwardPage(selectedApplicationStatus));
};
