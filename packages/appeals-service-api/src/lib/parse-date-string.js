const { isDate, parseISO } = require('date-fns');

module.exports = (value, originalValue) => {
  if (originalValue !== null) {
    return isDate(originalValue) ? originalValue : parseISO(originalValue);
  }
  return null;
};
