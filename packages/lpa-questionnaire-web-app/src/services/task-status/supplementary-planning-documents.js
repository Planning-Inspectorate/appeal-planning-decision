const { COMPLETED, NOT_STARTED } = require('../common/task-statuses');

module.exports = (appealReply) => {
  if (!appealReply) return null;

  if (
    !appealReply.optionalDocumentsSection ||
    !appealReply.optionalDocumentsSection.supplementaryPlanningDocuments.uploadedFiles ||
    appealReply.optionalDocumentsSection.supplementaryPlanningDocuments.uploadedFiles.length < 1
  ) {
    return NOT_STARTED;
  }

  return COMPLETED;
};
