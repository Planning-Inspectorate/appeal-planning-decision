const logger = require('../../../lib/logger');
const {
  VIEW: {
    HOUSEHOLDER_PLANNING: {
      ELIGIBILITY: { GRANTED_OR_REFUSED_HOUSEHOLDER: currentPage },
    },
  },
} = require('../../../lib/householder-planning/views');
const { createOrUpdateAppeal } = require('../../../lib/appeals-api-wrapper');
const {
  validApplicationDecisionOptions,
} = require('../../../validators/householder-planning/eligibility/granted-or-refused-householder');

const {
  HOUSEHOLDER_PLANNING: { PLANNING_APPLICATION_STATUS: applicationStatus },
} = require('../../../constants');

exports.forwardPage = (status) => {
  const statuses = {
    [applicationStatus.GRANTED]: '/before-you-start/decision-date-householder',
    [applicationStatus.NODECISION]: '/before-you-start/date-decision-due-householder',
    [applicationStatus.REFUSED]: '/before-you-start/decision-date-householder',
    previousPage: '/before-you-start/listed-building-householder',

    default: currentPage,
  };

  return statuses[status] || statuses.default;
};

exports.getGrantedOrRefusedHouseholder = async (req, res) => {
  res.render(currentPage, {
    appeal: req.session.appeal,
    previousPage: this.forwardPage('previousPage'),
  });
};

exports.postGrantedOrRefusedHouseholder = async (req, res) => {
  const { body } = req;
  const { appeal } = req.session;
  const { errors = {}, errorSummary = [] } = body;

  const applicationDecision = body['granted-or-refused'];
  let selectedApplicationStatus = null;

  if (validApplicationDecisionOptions.includes(applicationDecision)) {
    selectedApplicationStatus = applicationDecision.toLowerCase();
  }

  appeal.eligibility.applicationDecision = selectedApplicationStatus;

  if (Object.keys(errors).length > 0) {
    res.render(currentPage, {
      appeal,
      errors,
      errorSummary,
      previousPage: this.forwardPage('previousPage'),
    });
    return;
  }

  try {
    req.session.appeal = await createOrUpdateAppeal(appeal);
  } catch (e) {
    logger.error(e);

    res.render(currentPage, {
      appeal,
      errors,
      errorSummary: [{ text: e.toString(), href: '#' }],
      previousPage: this.forwardPage('previousPage'),
    });
    return;
  }

  res.redirect(this.forwardPage(selectedApplicationStatus));
};
