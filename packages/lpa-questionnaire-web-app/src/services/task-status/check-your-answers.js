const { CANNOT_START_YET, NOT_STARTED, COMPLETED } = require('./task-statuses');
const {
  accuracySubmissionCompletion,
  extraConditionsCompletion,
  otherAppealsCompletion,
  uploadPlansCompletion,
  officersReportCompletion,
  booleanCompletion,
} = require('.');

// This should only contain completion checks for required fields
const requiredCompletion = [
  accuracySubmissionCompletion,
  extraConditionsCompletion,
  otherAppealsCompletion,
  uploadPlansCompletion,
  officersReportCompletion,
  {
    id: 'siteSeenPublicLand',
    func: booleanCompletion,
  },
  {
    id: 'enterAppealSite',
    func: booleanCompletion,
  },
  {
    id: 'accessNeighboursLand',
    func: booleanCompletion,
  },
  {
    id: 'listedBuilding',
    func: booleanCompletion,
  },
  {
    id: 'greenBelt',
    func: booleanCompletion,
  },
  {
    id: 'nearConservationArea',
    func: booleanCompletion,
  },
];
module.exports = (appealReply) => {
  if (!appealReply) return null;

  if (appealReply.state === 'SUBMITTED') {
    return COMPLETED;
  }

  return requiredCompletion.every((check) => {
    return typeof check === 'object'
      ? check.func(appealReply, check.id) === COMPLETED
      : check(appealReply) === COMPLETED;
  })
    ? NOT_STARTED
    : CANNOT_START_YET;
};
