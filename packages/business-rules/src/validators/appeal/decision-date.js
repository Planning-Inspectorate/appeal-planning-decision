const { appeal, generic } = require('../../validation');

function isInThePast(value, ...rest) {
  const errorMessage = () => rest.errorMessage || 'The Decision Date must be in the past';

  /* istanbul ignore next */
  return this.test('decisionDate', errorMessage, (givenDate) => {
    return generic.date.isInThePast(givenDate);
  });
}

function isWithinDeadlinePeriod(value, ...rest) {
  const errorMessage = () => rest.errorMessage || 'The Decision Date has now passed';

  /* istanbul ignore next */
  return this.test('decisionDate', errorMessage, () =>
    appeal.decisionDate.isWithinDecisionDateExpiryPeriod(value),
  );
}

module.exports = {
  isInThePast,
  isWithinDeadlinePeriod,
};
