function validateAppeal(appealId, appeal) {
  const errors = [];

  // Start of Task List Validation

  // Validation for On Behalf of Applicant
  // NOTE - Cross screen validation - so only check when the Your Details Section State is COMPLETED
  // if isOriginalApplicant is false or empty then appealingOnBehalfOf must not be null or empty
  if (appeal.sectionStates.aboutYouSection.yourDetails === 'COMPLETED') {
    if (
      appeal.aboutYouSection.yourDetails.isOriginalApplicant === false &&
      (appeal.aboutYouSection.yourDetails.appealingOnBehalfOf === '' ||
        appeal.aboutYouSection.yourDetails.appealingOnBehalfOf === null)
    ) {
      errors.push(
        'Appeal has been entered by agent acting on behalf of applicant and must have an Appealing on Behalf Applicant Name'
      );
    }
  }

  // Planning Application File Upload
  if (
    appeal.requiredDocumentsSection.originalApplication.uploadedFile.id !== null &&
    appeal.requiredDocumentsSection.originalApplication.uploadedFile.name === ''
  ) {
    errors.push(
      'The planning application uploaded file must have a name for the file when it has an id'
    );
  }
  if (
    appeal.requiredDocumentsSection.originalApplication.uploadedFile.id === null &&
    appeal.requiredDocumentsSection.originalApplication.uploadedFile.name !== ''
  ) {
    errors.push(
      'The planning application uploaded file must have an id for the file when it has a name'
    );
  }

  // Appeal Statement File Upload
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

  // End of Task List Validation

  // Validate decision letter
  if (
    appeal.requiredDocumentsSection.decisionLetter.uploadedFile.id !== null &&
    appeal.requiredDocumentsSection.decisionLetter.uploadedFile.name === ''
  ) {
    errors.push(
      'The decision letter uploaded file must have a name for the file when it has an id'
    );
  }
  if (
    appeal.requiredDocumentsSection.decisionLetter.uploadedFile.name !== '' &&
    appeal.requiredDocumentsSection.decisionLetter.uploadedFile.id === null
  ) {
    errors.push(
      'The decision letter uploaded file must have an id for the file when it has a name'
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
