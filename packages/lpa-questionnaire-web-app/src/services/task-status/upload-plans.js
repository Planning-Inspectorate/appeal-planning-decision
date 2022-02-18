const { COMPLETED, NOT_STARTED } = require('../common/task-statuses');

module.exports = (appealReply) => {
  if (!appealReply) return null;

  const { uploadedFiles = [] } = appealReply.requiredDocumentsSection?.plansDecision;

  return uploadedFiles.length ? COMPLETED : NOT_STARTED;
};
