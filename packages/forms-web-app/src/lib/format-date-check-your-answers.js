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

const formatDate = (date) => {
  return {
    date: date.getDate(),
    day: weekdays[date.getDay()],
    month: months[date.getMonth()],
    year: date.getFullYear(),
  };
};

module.exports = formatDate;
