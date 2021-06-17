function isValidAppealForSendStartEmailToLPAEmail(appeal) {
  return (
    typeof appeal?.id !== 'undefined' &&
    typeof appeal?.lpaCode !== 'undefined' &&
    typeof appeal?.horizonId !== 'undefined' &&
    typeof appeal?.appealSiteSection?.siteAddress !== 'undefined' &&
    typeof appeal?.requiredDocumentsSection?.applicationNumber !== 'undefined'
  );
}

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
  isValidAppealForSendStartEmailToLPAEmail,
  isValidAppealForSubmissionReceivedNotificationEmail,
};
