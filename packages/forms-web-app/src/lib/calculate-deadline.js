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
    tempDate.setDate(tempDate.getDate() + numOfWeeksToDeadline * 7);
    return {
      date: tempDate.getDate(),
      day: weekdays[tempDate.getDay()],
      month: months[tempDate.getMonth()],
      year: tempDate.getFullYear(),
    };
  },
  fullAppealApplication: (decisionDate) => {
    const numOfMonthsToDeadline = 6;
    const tempDate = new Date(decisionDate);
    tempDate.setMonth(tempDate.getMonth() + numOfMonthsToDeadline);
    return {
      date: tempDate.getDate(),
      day: weekdays[tempDate.getDay()],
      month: months[tempDate.getMonth()],
      year: tempDate.getFullYear(),
    };
  },
};

module.exports = {
  calculateDeadline,
};
