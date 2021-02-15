const { COMPLETED, NOT_STARTED } = require('./task-statuses');

module.exports = (appealReply) => {
  if (!appealReply) return null;

  const { adjacentAppeals, appealReferenceNumbers } = appealReply?.aboutAppealSection?.otherAppeals;
  let completion;

  if (typeof adjacentAppeals === 'boolean') {
    completion = (!adjacentAppeals || (adjacentAppeals && appealReferenceNumbers)) && COMPLETED;
  }

  return completion || NOT_STARTED;
};
