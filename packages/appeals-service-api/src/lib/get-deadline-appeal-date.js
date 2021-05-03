const { addWeeks, endOfDay } = require('date-fns');

module.exports = (decisionDate) => {
  return addWeeks(endOfDay(decisionDate), 12);
};