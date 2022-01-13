const logger = require('../../lib/logger');
const {
  VIEW: {
    FULL_APPEAL: { GRANTED_OR_REFUSED: currentPage },
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

    default: currentPage,
  };

  return statuses[status] || statuses.default;
};

exports.getGrantedOrRefused = async (req, res) => {
  res.render(currentPage, {
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

  res.redirect(`${this.forwardPage(selectedApplicationStatus)}`);
};
