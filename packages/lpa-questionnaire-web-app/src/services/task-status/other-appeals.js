const { COMPLETED, NOT_STARTED } = require('./task-statuses');

module.exports = (appealReply) => {
  if (!appealReply) return null;

  const task = appealReply.aboutAppealSection?.otherAppeals;
  let completion;

  if (typeof task.adjacentAppeals === 'boolean') {
    completion =
      (!task.adjacentAppeals || (task.adjacentAppeals && task.appealReferenceNumbers)) && COMPLETED;
  }

  return completion || NOT_STARTED;
};
