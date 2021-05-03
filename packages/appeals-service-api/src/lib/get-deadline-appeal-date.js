const { addWeeks, endOfDay, parseISO } = require('date-fns');

module.exports = (decisionDate) => {
 return addWeeks(endOfDay(decisionDate), 12);
};