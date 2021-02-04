const { isDate, parseISO } = require('date-fns');

function parseDateString(value, originalValue) {
  if (originalValue !== null) {
    return isDate(originalValue) ? originalValue : parseISO(originalValue);
  }
  return null;
}

module.exports = { parseDateString };
