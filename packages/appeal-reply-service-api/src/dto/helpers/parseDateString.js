const { parse, isDate } = require('date-fns');

function parseDateString(value, originalValue) {
  if (originalValue !== null) {
    return isDate(originalValue) ? originalValue : parse(originalValue, 'yyyy-MM-dd', new Date());
  }
  return null;
}

module.exports = { parseDateString };
