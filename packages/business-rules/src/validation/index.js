const isWithinDecisionDateExpiryPeriod = require('./appeal/decision-date/is-within-decision-date-expiry-period');
const dateIsInThePast = require('./generic/date/is-in-the-past');
const isValid = require('./appeal/type/is-valid');
const isValidApplicationDecision = require('./appeal/application-decision/is-valid');

/**
 * Export an object with a descriptive shape, to make use of the validation logic more obvious
 * at call site.
 */
module.exports = {
  appeal: {
    applicationDecision: {
      isValidApplicationDecision,
    },
    decisionDate: {
      isWithinDecisionDateExpiryPeriod,
    },
    type: {
      isValid,
    },
  },
  generic: {
    date: {
      isInThePast: dateIsInThePast,
    },
  },
};
