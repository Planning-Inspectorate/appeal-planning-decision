const { isInThePast, isWithinDeadlinePeriod } = require('./appeal/decision-date');
const conditionalText = require('./common/conditional-text');

module.exports = {
  appeal: {
    decisionDate: {
      isInThePast,
      isWithinDeadlinePeriod,
    },
    conditionalText,
  },
};
