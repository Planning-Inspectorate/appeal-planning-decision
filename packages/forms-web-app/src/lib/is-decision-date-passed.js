const { isBefore, endOfDay, parseISO } = require('date-fns');
const getDeadlineAppealDate = require('./get-deadline-appeal-date');

module.exports = (appeal) => {
  const today = endOfDay(new Date());
  const decisionDatePassed =
    !appeal.decisionDate || isBefore(getDeadlineAppealDate(parseISO(appeal.decisionDate)), today);

  return decisionDatePassed;
};
