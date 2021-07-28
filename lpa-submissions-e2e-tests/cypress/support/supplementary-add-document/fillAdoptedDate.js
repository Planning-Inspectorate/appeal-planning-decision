const {
  dayInput,
  monthInput,
  yearInput,
} = require('../PageObjects/SupplementaryAddDocumentsPageObjects');

module.exports = (day, month, year) => {
  if (day) dayInput().type(day);
  if (month) monthInput().type(month);
  if (year) yearInput().type(year);
};
