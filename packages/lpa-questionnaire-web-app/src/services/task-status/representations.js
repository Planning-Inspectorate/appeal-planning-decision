const { COMPLETED, NOT_STARTED } = require('./task-statuses');

module.exports = (appealReply) => {
  if (!appealReply) return null;

  const {
    uploadedFiles = [],
  } = appealReply.optionalDocumentsSection?.representationsInterestedParties;

  return uploadedFiles.length ? COMPLETED : NOT_STARTED;
};
