const { isBefore, endOfDay, parseISO } = require('date-fns');
const getDeadlineAppealDate = require('./get-deadline-appeal-date');

module.exports = (appeal) => {
 const today = endOfDay(new Date());
 const decisionDatePassed =
  !appeal.decisionDate || isBefore(getDeadlineAppealDate(appeal.decisionDate), today);

 return decisionDatePassed;
};