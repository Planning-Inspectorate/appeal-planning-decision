function validateAppeal(appealId, appeal) {
  const errors = [];

  // Start of Task List Validation

  // About You Section

  // Your Details
  // Only accepted states are name and email both empty or both valued
  if (
    (!appeal.aboutYouSection.yourDetails.name && appeal.aboutYouSection.yourDetails.email) ||
    (appeal.aboutYouSection.yourDetails.name && !appeal.aboutYouSection.yourDetails.email)
  ) {
    let yourDetailsErrorMessage = 'The appeal appellant details must have email and name valued.';
    yourDetailsErrorMessage += appeal.aboutYouSection.yourDetails.name
      ? 'The email is missing.'
      : 'The name is missing.';

    errors.push(yourDetailsErrorMessage);
  }

  // Access Appeal Site
  // if canInspectorSeeWholeSiteFromPublicRoad is true then howIsSiteAccessRestricted must be null or empty
  if (
    appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad === true &&
    appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted !== null &&
    appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted !== ''
  ) {
    errors.push(
      'If appeal site is visible from the public road then site access restrictions is not required'
    );
  }

  // if canInspectorSeeWholeSiteFromPublicRoad is false thenhowIsSiteAccessRestricted must not be null or empty
  if (
    appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad === false &&
    (appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted === null ||
      appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted === '')
  ) {
    errors.push(
      'If appeal site is not visible from the public road then site access restrictions is required'
    );
  }

  // if canInspectorSeeWholeSiteFromPublicRoad is empty then howIsSiteAccessRestricted must be null or empty
  if (
    appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad === null &&
    appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted !== null &&
    appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted !== ''
  ) {
    errors.push(
      'If appeal site from public road is null then site access restrictions must be null or empty'
    );
  }

  // Site Ownership
  if (
    appeal.appealSiteSection.siteOwnership.ownsWholeSite &&
    appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold !== null
  ) {
    errors.push('If the appellant owns the whole appeal site there can be no other owners');
  }

  if (
    appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold &&
    appeal.appealSiteSection.siteOwnership.ownsWholeSite === null
  ) {
    errors.push('We should know if there is another owners before knowing if they were told');
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

  // Health and Safety
  if (
    appeal.appealSiteSection.healthAndSafety.hasIssues &&
    appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues === ''
  ) {
    errors.push('If the health and safety task has issues, they need to be valued');
  }

  if (
    !appeal.appealSiteSection.healthAndSafety.hasIssues &&
    appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues
  ) {
    errors.push(
      'The appeal does not states that there is health and safety issues but the field is valued'
    );
  }

  // Validation for On Behalf of Applicant, name and email address
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
    if (
      appeal.aboutYouSection.yourDetails.name === null ||
      appeal.aboutYouSection.yourDetails.name === ''
    ) {
      errors.push(
        'If your details section is completed then appellant name cannot be null or empty and it must be specified'
      );
    }
    if (
      appeal.aboutYouSection.yourDetails.email === null ||
      appeal.aboutYouSection.yourDetails.email === ''
    ) {
      errors.push(
        'If your details section is completed then appellant email address cannot be null or empty and it must be specified'
      );
    }
  }

  // End of Task List Validation

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
