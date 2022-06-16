const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const calculateDeadline = {
  householderApplication: (decisionDate) => {
    const numOfWeeksToDeadline = 12;
    const tempDate = new Date(decisionDate);
    tempDate.setDate(tempDate.getDate() + numOfWeeksToDeadline * 7 - 1);
    return tempDate;
  },
  fullAppealApplication: (decisionDate) => {
    const numOfMonthsToDeadline = 6;
    const tempDate = new Date(decisionDate);
    tempDate.setMonth(tempDate.getMonth() + numOfMonthsToDeadline);
    tempDate.setDate(tempDate.getDate() - 1);
    return tempDate;
  },
};

module.exports = {
  calculateDeadline,
};
