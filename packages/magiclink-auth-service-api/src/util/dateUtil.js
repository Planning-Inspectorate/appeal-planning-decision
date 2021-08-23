function addMillisToCurrentDate(timeInMillis) {
  return new Date(Date.now() + timeInMillis);
}

module.exports = {
  addMillisToCurrentDate,
};
