const logger = require('../../lib/logger');
const {
  VIEW: {
    FULL_APPEAL: { GRANTED_OR_REFUSED },
  },
} = require('../../lib/views');
const { createOrUpdateAppeal } = require('../../lib/appeals-api-wrapper');
const {
  validApplicationDecisionOptions,
} = require('../../validators/full-appeal/granted-or-refused');

const {
  FULL_APPEAL: { PLANNING_APPLICATION_STATUS },
} = require('../../constants');

exports.forwardPage = (status) => {
  const statuses = {
    [PLANNING_APPLICATION_STATUS.GRANTED]: '/before-you-start/decision-date',
    [PLANNING_APPLICATION_STATUS.NODECISION]: '/before-you-start/date-decision-due',
    [PLANNING_APPLICATION_STATUS.REFUSED]: '/before-you-start/decision-date',
    previousPage: '/before-you-start/any-of-following',

    default: GRANTED_OR_REFUSED,
  };

  return statuses[status] || statuses.default;
};

exports.getGrantedOrRefused = async (req, res) => {
  res.render(GRANTED_OR_REFUSED, {
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

  res.redirect(`${this.forwardPage(selectedApplicationStatus)}`);
};
