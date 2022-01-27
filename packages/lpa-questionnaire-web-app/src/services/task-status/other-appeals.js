const { COMPLETED, NOT_STARTED } = require('../common/task-statuses');

module.exports = (appealReply) => {
  if (!appealReply) return null;

  const task = appealReply.aboutAppealSection?.otherAppeals;
  let completion;

  if (task && typeof task.adjacentAppeals === 'boolean') {
    completion =
      (!task.adjacentAppeals || (task.adjacentAppeals && task.appealReferenceNumbers)) && COMPLETED;
  }

  return completion || NOT_STARTED;
};
