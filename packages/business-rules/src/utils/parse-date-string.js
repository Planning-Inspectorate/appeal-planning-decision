const { isDate, isValid, parseISO } = require('date-fns');
const BusinessRuleError = require('../lib/business-rule-error');

function isISODate(date) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(date)) return false;
  const d = new Date(date);
  return d.toISOString() === date;
}

const parseDateString = (value, originalValue) => {
  if (originalValue === null || (isDate(originalValue) && isValid(originalValue))) {
    return originalValue;
  }

  if (isISODate(originalValue)) {
    return parseISO(originalValue);
  }

  throw new BusinessRuleError('Invalid Date or string not ISO format');
};

module.exports = parseDateString;
