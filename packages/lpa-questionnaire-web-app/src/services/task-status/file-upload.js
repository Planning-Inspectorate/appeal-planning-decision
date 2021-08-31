const { COMPLETED, NOT_STARTED } = require('./task-statuses');

module.exports = (appealReply, taskId, section) => {
  let uploadedFiles;
  if (!appealReply) return null;

  if (!appealReply[section] || !appealReply[section][taskId]) {
    uploadedFiles = [];
  } else {
    uploadedFiles = appealReply[section][taskId].uploadedFiles;
  }

  return uploadedFiles.length ? COMPLETED : NOT_STARTED;
};
