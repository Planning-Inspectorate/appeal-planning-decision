/**
 * Creates a Date object by adding the given input number of milliseconds to the current Date.
 *
 * @param timeInMillis milliseconds to be added to the current date
 * @returns {Date}
 */
function addMillisToCurrentDate(timeInMillis) {
  return new Date(Date.now() + timeInMillis);
}

module.exports = {
  addMillisToCurrentDate,
};
