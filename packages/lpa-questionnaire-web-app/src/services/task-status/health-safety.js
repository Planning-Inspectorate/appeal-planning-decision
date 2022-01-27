const { COMPLETED, NOT_STARTED } = require('../common/task-statuses');

module.exports = (appealReply) => {
  if (!appealReply) return null;

  const task = appealReply.healthSafety;
  let completion;

  if (task && typeof task.hasHealthSafety === 'boolean') {
    completion =
      (!task.hasHealthSafety || (task.hasHealthSafety && task.healthSafetyIssues)) && COMPLETED;
  }

  return completion || NOT_STARTED;
};
