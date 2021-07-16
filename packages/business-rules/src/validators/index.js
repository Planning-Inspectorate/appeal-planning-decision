const { isInThePast, isWithinDeadlinePeriod } = require('./appeal/decision-date');

module.exports = {
  appeal: {
    decisionDate: {
      isInThePast,
      isWithinDeadlinePeriod,
    },
  },
};
