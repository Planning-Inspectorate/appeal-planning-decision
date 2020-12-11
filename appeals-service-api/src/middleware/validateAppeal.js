function validateAppeal(appealId, appeal) {
  const errors = [];

  if (
    appeal.yourAppealSection.appealStatement.uploadedFile.id !== null &&
    appeal.yourAppealSection.appealStatement.uploadedFile.name === ''
  ) {
    errors.push(
      'The appeal statement uploaded file must have a name for the file when it has an id'
    );
  }
  if (
    appeal.yourAppealSection.appealStatement.uploadedFile.name !== '' &&
    appeal.yourAppealSection.appealStatement.uploadedFile.id === null
  ) {
    errors.push(
      'The appeal statement uploaded file must have an id for the file when it has a name'
    );
  }
  if (
    (appeal.yourAppealSection.appealStatement.uploadedFile.name !== '' ||
      appeal.yourAppealSection.appealStatement.uploadedFile.id !== null) &&
    appeal.yourAppealSection.appealStatement.hasSensitiveInformation !== false
  ) {
    errors.push(
      'The appeal statement uploaded file cannot be accepted unless it is confirmed to have no sensitive information'
    );
  }
  if (appealId !== appeal.id) {
    errors.push('The provided id in path must be the same as the appeal id in the request body');
  }
  if (
    appeal.state === 'SUBMITTED' &&
    (appeal.sectionStates.aboutYouSection.yourDetails !== 'COMPLETED' ||
      appeal.sectionStates.requiredDocumentsSection.applicationNumber !== 'COMPLETED' ||
      appeal.sectionStates.requiredDocumentsSection.originalApplication !== 'COMPLETED' ||
      appeal.sectionStates.requiredDocumentsSection.decisionLetter !== 'COMPLETED' ||
      appeal.sectionStates.yourAppealSection.appealStatement !== 'COMPLETED' ||
      appeal.sectionStates.yourAppealSection.otherDocuments !== 'COMPLETED' ||
      appeal.sectionStates.yourAppealSection.otherAppeals !== 'COMPLETED' ||
      appeal.sectionStates.appealSiteSection.siteAccess !== 'COMPLETED' ||
      appeal.sectionStates.appealSiteSection.siteOwnership !== 'COMPLETED' ||
      appeal.sectionStates.appealSiteSection.healthAndSafety !== 'COMPLETED')
  ) {
    errors.push('The appeal state cannot be SUBMITTED if any sections are not COMPLETED');
  }
  return errors;
}
module.exports = { validateAppeal };
