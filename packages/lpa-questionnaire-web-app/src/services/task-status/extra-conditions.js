const { COMPLETED, NOT_STARTED } = require('../common/task-statuses');

module.exports = (appealReply) => {
  if (!appealReply) return null;

  const task = appealReply.aboutAppealSection?.extraConditions;
  let completion;

  if (task && typeof task.hasExtraConditions === 'boolean') {
    completion =
      (!task.hasExtraConditions || (task.hasExtraConditions && task.extraConditions)) && COMPLETED;
  }

  return completion || NOT_STARTED;
};
