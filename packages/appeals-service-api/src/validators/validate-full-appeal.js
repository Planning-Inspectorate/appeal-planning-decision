const {
  constants: { APPEAL_STATE, APPLICATION_DECISION, KNOW_THE_OWNERS, PROCEDURE_TYPE },
} = require('@pins/business-rules');

const validateFullAppeal = (appeal) => {
  const {
    state,
    eligibility: { applicationDecision },
    contactDetailsSection: { appealingOnBehalfOf, isOriginalApplicant },
    appealSiteSection: {
      siteOwnership: {
        advertisingYourAppeal,
        hasIdentifiedTheOwners,
        knowsTheOwners,
        ownsAllTheLand,
        ownsSomeOfTheLand,
        tellingTheLandowners,
      },
      agriculturalHolding: { hasOtherTenants, isAgriculturalHolding, isTenant, tellingTheTenants },
    },
    appealDecisionSection: { draftStatementOfCommonGround, hearing, inquiry, procedureType },
    planningApplicationDocumentsSection: { decisionLetter, designAccessStatement },
    appealDocumentsSection: { plansDrawings, supportingDocuments },
  } = appeal;
  const errors = [];

  if (state !== APPEAL_STATE.SUBMITTED) {
    return errors;
  }

  if (isOriginalApplicant === false && !appealingOnBehalfOf.name) {
    errors.push(
      "If you are appealing on behalf of the applicant then the applicant's name is required"
    );
  }

  if (ownsAllTheLand === false && [null, ''].includes(ownsSomeOfTheLand)) {
    errors.push("If you don't own all the land then you must specify if you own some of the land");
  }

  if (ownsAllTheLand === false && [null, ''].includes(knowsTheOwners)) {
    errors.push(
      "If you don't own all the land then you must specify if you know who owns the land"
    );
  }

  if (knowsTheOwners === KNOW_THE_OWNERS.YES && !tellingTheLandowners) {
    errors.push(
      'If you know who owns all of the land then you must confirm that you have told the other landowners'
    );
  }

  if (knowsTheOwners === KNOW_THE_OWNERS.SOME && [null, ''].includes(hasIdentifiedTheOwners)) {
    errors.push(
      'If you know who owns some of the land then you must confirm that you have identified the other landowners'
    );
  }

  if (knowsTheOwners === KNOW_THE_OWNERS.SOME && !advertisingYourAppeal) {
    errors.push(
      'If you know who owns some of the land then you must confirm that you have advertised your appeal'
    );
  }

  if (knowsTheOwners === KNOW_THE_OWNERS.NO && [null, ''].includes(hasIdentifiedTheOwners)) {
    errors.push(
      "If you don't know who owns the land then you must confirm that you have identified the other landowners"
    );
  }

  if (knowsTheOwners === KNOW_THE_OWNERS.NO && !advertisingYourAppeal) {
    errors.push(
      "If you don't know who owns the land then you must confirm that you have advertised your appeal"
    );
  }

  if (isAgriculturalHolding && [null, ''].includes(isTenant)) {
    errors.push(
      'If the appeal site is part of an agricultural holding then you must confirm if you are a tenant'
    );
  }

  if (isTenant && [null, ''].includes(hasOtherTenants)) {
    errors.push(
      'If you are a tenant of the agricultural holding then you must confirm if there are any other tenants'
    );
  }

  if (isAgriculturalHolding && !tellingTheTenants) {
    errors.push(
      'If the appeal site is part of an agricultural holding then you must confirm that you have told the other tenants'
    );
  }

  if (procedureType === PROCEDURE_TYPE.HEARING && !hearing.reason) {
    errors.push(
      'If you would prefer your appeal to be decided by hearing then you must give a reason'
    );
  }

  if (procedureType === PROCEDURE_TYPE.HEARING && !draftStatementOfCommonGround.uploadedFile.id) {
    errors.push(
      'If you would prefer your appeal to be decided by hearing then you must upload your draft statement of common ground'
    );
  }

  if (procedureType === PROCEDURE_TYPE.INQUIRY && !inquiry.reason) {
    errors.push(
      'If you would prefer your appeal to be decided by inquiry then you must give a reason'
    );
  }

  if (procedureType === PROCEDURE_TYPE.INQUIRY && !inquiry.expectedDays) {
    errors.push(
      'If you would prefer your appeal to be decided by inquiry then you must enter the number of days you expect the inquriy to last'
    );
  }

  if (procedureType === PROCEDURE_TYPE.INQUIRY && !draftStatementOfCommonGround.uploadedFile.id) {
    errors.push(
      'If you would prefer your appeal to be decided by inquiry then you must upload your draft statement of common ground'
    );
  }

  if (designAccessStatement.isSubmitted && !designAccessStatement.uploadedFile.id) {
    errors.push(
      'Your design and access statement must be uploaded if you submitted one with your application'
    );
  }

  if (plansDrawings.hasPlansDrawings && !plansDrawings.uploadedFiles.length) {
    errors.push('Your new plans and drawings must be uploaded');
  }

  if (supportingDocuments.hasSupportingDocuments && !supportingDocuments.uploadedFiles.length) {
    errors.push('Your other new supporting documents must be uploaded');
  }

  if (applicationDecision === APPLICATION_DECISION.GRANTED && !decisionLetter.uploadedFile.id) {
    errors.push(
      'If your planning application was granted then you must upload the decision letter'
    );
  }

  if (applicationDecision === APPLICATION_DECISION.REFUSED && !decisionLetter.uploadedFile.id) {
    errors.push(
      'If your planning application was refused then you must upload the decision letter'
    );
  }

  return errors;
};

module.exports = validateFullAppeal;
