const { COMPLETED, NOT_STARTED } = require('../common/task-statuses');

module.exports = (appealReply) => {
  if (!appealReply) return null;

  const task = appealReply.aboutAppealSection?.submissionAccuracy;
  let completion;

  if (task && typeof task.accurateSubmission === 'boolean') {
    completion =
      (task.accurateSubmission || (!task.accurateSubmission && task.inaccuracyReason)) && COMPLETED;
  }

  return completion || NOT_STARTED;
};
