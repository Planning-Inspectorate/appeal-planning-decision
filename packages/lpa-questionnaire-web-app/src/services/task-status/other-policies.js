const { COMPLETED, NOT_STARTED } = require('./task-statuses');

module.exports = (appealReply) => {
  if (!appealReply) return null;

  const { uploadedFiles = [] } = appealReply.optionalDocumentsSection?.otherPolicies;

  return uploadedFiles.length ? COMPLETED : NOT_STARTED;
};
