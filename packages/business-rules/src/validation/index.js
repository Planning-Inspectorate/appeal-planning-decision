const isWithinDecisionDateExpiryPeriod = require('./appeal/decision-date/is-within-decision-date-expiration-period');
const dateIsInThePast = require('./generic/date/is-in-the-past');

/**
 * Export an object with a descriptive shape, to make use of the validation logic more obvious
 * at call site.
 */
module.exports = {
  appeal: {
    decisionDate: {
      isWithinDecisionDateExpiryPeriod,
    },
  },
  generic: {
    date: {
      isInThePast: dateIsInThePast,
    },
  },
};
