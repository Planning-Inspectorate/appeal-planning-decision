const pinsYup = require('../lib/pins-yup');

const businessRules = pinsYup.object().shape({
  decisionDate: pinsYup.lazy((decisionDate) => {
    return pinsYup
      .date()
      .isInThePast(decisionDate)
      .isWithinDeadlinePeriod(decisionDate)
      .default(null);
  }),
});

module.exports = businessRules;
