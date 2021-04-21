function isValidAppealForSubmissionReceivedNotificationEmail(appeal) {
  return (
    typeof appeal?.id !== 'undefined' &&
    typeof appeal?.lpaCode !== 'undefined' &&
    typeof appeal?.submissionDate !== 'undefined' &&
    typeof appeal?.requiredDocumentsSection?.applicationNumber !== 'undefined' &&
    typeof appeal?.appealSiteSection?.siteAddress !== 'undefined'
  );
}

module.exports = {
  isValidAppealForSubmissionReceivedNotificationEmail,
};
