const { COMPLETED, NOT_STARTED } = require('../common/task-statuses');

module.exports = (appealReply) => {
  if (!appealReply) return null;

  const task = appealReply.optionalDocumentsSection?.developmentOrNeighbourhood;
  let completion;

  if (task && typeof task.hasPlanSubmitted === 'boolean') {
    completion =
      (!task.hasPlanSubmitted || (task.hasPlanSubmitted && task.planChanges)) && COMPLETED;
  }

  return completion || NOT_STARTED;
};
