const { isDate, isValid, parseISO } = require('date-fns');

function isISODate(date) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(date)) return false;
  const d = new Date(date);
  return d.toISOString() === date;
}

module.exports = (value, originalValue) => {
  if (originalValue === null || (isDate(originalValue) && isValid(originalValue))) {
    return originalValue;
  }

  if (isISODate(originalValue)) {
    return parseISO(originalValue);
  }

  // Not throwns as it would break the appeal yup validation
  return new Error('Invalid Date or string not ISO format');
};
