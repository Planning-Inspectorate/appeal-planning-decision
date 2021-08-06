const { appeal, generic } = require('../../validation');
const createYupError = require('../../utils/create-yup-error');

function isInThePast(value, ...rest) {
  const errorMessage = rest.errorMessage || 'must be in the past';
  return this.test('decisionDate', null, function test() {
    return generic.date.isInThePast(value) || createYupError.call(this, errorMessage);
  });
}

function isWithinDeadlinePeriod(value, ...rest) {
  const errorMessage = rest.errorMessage || 'must be before the deadline date';
  return this.test('decisionDate', null, function test() {
    return (
      appeal.decisionDate.isWithinDecisionDateExpiryPeriod(value) ||
      createYupError.call(this, errorMessage)
    );
  });
}

module.exports = {
  isInThePast,
  isWithinDeadlinePeriod,
};
