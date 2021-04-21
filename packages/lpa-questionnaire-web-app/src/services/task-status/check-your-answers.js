const { CANNOT_START_YET, NOT_STARTED, COMPLETED } = require('./task-statuses');
const {
  accuracySubmissionCompletion,
  extraConditionsCompletion,
  otherAppealsCompletion,
  uploadPlansCompletion,
  officersReportCompletion,
} = require('.');

// This should only contain completion checks for required fields
const requiredCompletion = [
  accuracySubmissionCompletion,
  extraConditionsCompletion,
  otherAppealsCompletion,
  uploadPlansCompletion,
  officersReportCompletion,
];
module.exports = (appealReply) => {
  if (!appealReply) return null;

  if (appealReply.state === 'SUBMITTED') {
    return COMPLETED;
  }

  return requiredCompletion.every((check) => {
    return check(appealReply) === COMPLETED;
  })
    ? NOT_STARTED
    : CANNOT_START_YET;
};
