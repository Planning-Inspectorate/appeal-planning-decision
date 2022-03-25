const {
  constants: { APPEAL_ID },
} = require('@pins/business-rules');
const mongodb = require('../db/db');
const queue = require('../lib/queue');
const logger = require('../lib/logger');
const ApiError = require('../error/apiError');
const {
  sendSubmissionReceivedEmailToLpa,
  sendSubmissionConfirmationEmailToAppellant,
} = require('../lib/notify');
const validateFullAppeal = require('../validators/validate-full-appeal');

const APPEALS = 'appeals';

const validateAppeal = (appeal) => {
  const errors = [];

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

  // Appeal Site Section

  // Site Address
  // All mandatory fields are valued or none of them are the only accepted states.
  if (
    (appeal.appealSiteSection.siteAddress.addressLine1 ||
      appeal.appealSiteSection.siteAddress.postcode) &&
    !(
      appeal.appealSiteSection.siteAddress.postcode &&
      appeal.appealSiteSection.siteAddress.addressLine1
    )
  ) {
    const siteAddressErrorMessage = `The appeal appellant site address must have addressLine1 and postcode valued.
    addressLine1=${appeal.appealSiteSection.siteAddress.addressLine1}
    postcode=${appeal.appealSiteSection.siteAddress.postcode}`;

    errors.push(siteAddressErrorMessage);
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

  // if canInspectorSeeWholeSiteFromPublicRoad is false then howIsSiteAccessRestricted must not be null or empty
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

  // Appeal PDF Submission File Upload
  // if (
  //   appeal.appealSubmission.appealPDFStatement.uploadedFile.id !== null &&
  //   appeal.appealSubmission.appealPDFStatement.uploadedFile.name === ''
  // ) {
  //   errors.push(
  //     'The appeal statement pdf uploaded file must have a name for the file when it has an id'
  //   );
  // }
  // if (
  //   appeal.appealSubmission.appealPDFStatement.uploadedFile.name !== '' &&
  //   appeal.appealSubmission.appealPDFStatement.uploadedFile.id === null
  // ) {
  //   errors.push(
  //     'The appeal statement pdf uploaded file must have an id for the file when it has a name'
  //   );
  // }
  // Validate supporting documents
  appeal.yourAppealSection.otherDocuments.uploadedFiles.forEach((supportingDocument) => {
    const { id, name } = supportingDocument;

    if ((id !== null && name === '') || (id === null && name !== '')) {
      let supportingDocumentErrorMessage = `The supporting document must have id and name valued.`;
      supportingDocumentErrorMessage += id
        ? `The name is missing. id=${id}`
        : `The id is missing. name=${name}`;

      errors.push(supportingDocumentErrorMessage);
    }
  });

  // Health and Safety
  if (
    appeal.appealSiteSection.healthAndSafety.hasIssues &&
    appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues === ''
  ) {
    errors.push('If the health and safety task has issues, they need to be valued');
  }

  if (
    !appeal.appealSiteSection.healthAndSafety.hasIssues &&
    appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues !== ''
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
  if (
    appeal.state === 'SUBMITTED' &&
    (appeal.sectionStates.aboutYouSection.yourDetails !== 'COMPLETED' ||
      appeal.sectionStates.requiredDocumentsSection.applicationNumber !== 'COMPLETED' ||
      appeal.sectionStates.requiredDocumentsSection.originalApplication !== 'COMPLETED' ||
      appeal.sectionStates.requiredDocumentsSection.decisionLetter !== 'COMPLETED' ||
      appeal.sectionStates.yourAppealSection.appealStatement !== 'COMPLETED' ||
      appeal.sectionStates.appealSiteSection.siteAccess !== 'COMPLETED' ||
      appeal.sectionStates.appealSiteSection.siteOwnership !== 'COMPLETED' ||
      appeal.sectionStates.appealSiteSection.healthAndSafety !== 'COMPLETED')
  ) {
    errors.push(
      'The appeal state cannot be SUBMITTED if any sections except Other Documents are not COMPLETED'
    );
  }
  return errors;
};

const getAppeal = async (id) => {
  return mongodb.get().collection(APPEALS).findOne({ _id: id });
};

const insertAppeal = async (appeal) => {
  return mongodb.get().collection('appeals').insertOne({ _id: appeal.id, uuid: appeal.id, appeal });
};

const replaceAppeal = async (appeal) => {
  return mongodb
    .get()
    .collection(APPEALS)
    .findOneAndUpdate(
      { _id: appeal.id },
      { $set: { uuid: appeal.id, appeal } },
      { returnOriginal: false, upsert: false }
    );
};

function isValidAppeal(appeal) {
  if (!appeal.appealType) {
    return true;
  }

  let errors;

  if (appeal.appealType === APPEAL_ID.PLANNING_SECTION_78) {
    errors = validateFullAppeal(appeal);
  } else {
    errors = validateAppeal(appeal);
  }

  if (errors.length > 0) {
    logger.debug(`Validated payload for appeal update generated errors:\n ${appeal}\n${errors}`);
    throw ApiError.badRequest({ errors });
  }

  return errors.length === 0;
}

const updateAppeal = async (appeal, isFirstSubmission = false) => {
  isValidAppeal(appeal);

  const now = new Date(new Date().toISOString());

  /* eslint no-param-reassign: ["error", { "props": false }] */
  appeal.updatedAt = now;

  if (isFirstSubmission) {
    appeal.submissionDate = now;
  }

  const updatedDocument = await replaceAppeal(appeal);

  if (isFirstSubmission) {
    await queue.addAppeal(updatedDocument.value);
    await sendSubmissionConfirmationEmailToAppellant(updatedDocument.value.appeal);
    await sendSubmissionReceivedEmailToLpa(updatedDocument.value.appeal);
  }

  logger.debug(`Updated appeal ${appeal.id}\n`);

  return updatedDocument.value;
};

const isAppealSubmitted = async (appealId) => {
  return mongodb
    .get()
    .collection(APPEALS)
    .find({ _id: appealId, 'appeal.state': 'SUBMITTED' })
    .limit(1)
    .count()
    .then((n) => {
      return n === 1;
    });
};

module.exports = {
  getAppeal,
  insertAppeal,
  updateAppeal,
  validateAppeal,
  isAppealSubmitted,
};
