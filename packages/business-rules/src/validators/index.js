const { isInThePast, isWithinDeadlinePeriod } = require('./appeal/decision-date');
const conditionalText = require('./common/conditional-text');
const { allOf } = require('./common/array');

module.exports = {
  appeal: {
    decisionDate: {
      isInThePast,
      isWithinDeadlinePeriod,
    },
    conditionalText,
    allOf,
  },
};
