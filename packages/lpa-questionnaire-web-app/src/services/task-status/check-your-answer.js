const { CANNOT_START_YET } = require('./task-statuses');

module.exports = () => {
  // TODO: needs to check questionnaire status to allow check
  return CANNOT_START_YET;
};
