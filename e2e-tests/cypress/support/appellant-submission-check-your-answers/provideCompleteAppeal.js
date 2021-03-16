module.exports = (appeal, overrides = {}) => {
  cy.goToHouseholderQuestionPage();
  cy.provideHouseholderAnswerYes();

  if (appeal.eligibility.householderPlanningPermission) {
    cy.provideHouseholderAnswerYes();
  } else {
    cy.provideHouseholderAnswerNo();
  }
  cy.clickSaveAndContinue();

  cy.goToDecisionDatePage();

  cy.provideDecisionDate(appeal.decisionDate);

  if (appeal.eligibility.eligibleLocalPlanningDepartment) {
    cy.provideEligibleLocalPlanningDepartment(overrides);
  } else {
    cy.provideIneigibleLocalPlanningDepartment();
  }
  cy.clickSaveAndContinue();

  cy.goToEnforcementNoticePage();

  cy.provideEnforcementNoticeAnswer(appeal.eligibility.enforcementNotice === true);
  cy.clickSaveAndContinue();

  if (appeal.eligibility.listedBuilding) {
    cy.stateCaseDoesNotInvolveAListedBuilding();
  } else {
    cy.stateCaseInvolvesListedBuilding();
  }

  cy.goToCostsPage();
  if (appeal.eligibility.isClaimingCosts) {
    cy.provideCostsAnswerYes();
  } else {
    cy.provideCostsAnswerNo();
  }
  cy.clickSaveAndContinue();

  cy.goToTaskListPage();

  cy.goToWhoAreYouPage();

  if (appeal.aboutYouSection.yourDetails.isOriginalApplicant) {
    cy.answerYesOriginalAppellant();
  } else {
    cy.answerNoOriginalAppellant();
  }
  cy.clickSaveAndContinue();

  cy.provideDetailsName(appeal.aboutYouSection.yourDetails.name);
  cy.provideDetailsEmail(appeal.aboutYouSection.yourDetails.email);
  cy.clickSaveAndContinue();

  if (!appeal.aboutYouSection.yourDetails.isOriginalApplicant) {
    cy.provideNameOfOriginalApplicant(appeal.aboutYouSection.yourDetails.appealingOnBehalfOf);
    cy.clickSaveAndContinue();
  }

  cy.goToPlanningApplicationNumberPage();
  cy.providePlanningApplicationNumber(appeal.requiredDocumentsSection.applicationNumber);

  cy.goToPlanningApplicationSubmission();
  cy.uploadPlanningApplicationFile(
    appeal.requiredDocumentsSection.originalApplication.uploadedFile.name,
  );
  cy.clickSaveAndContinue();

  cy.goToDecisionLetterPage();
  cy.uploadDecisionLetterFile(appeal.requiredDocumentsSection.decisionLetter.uploadedFile.name);
  cy.clickSaveAndContinue();

  cy.goToAppealStatementSubmission();
  cy.checkNoSensitiveInformation();
  cy.uploadAppealStatementFile(appeal.yourAppealSection.appealStatement.uploadedFile.name);
  cy.clickSaveAndContinue();

  if (appeal.yourAppealSection.otherDocuments.uploadedFiles.length > 0) {
    cy.goToSupportingDocumentsPage();
    cy.uploadSupportingDocuments(
      appeal.yourAppealSection.otherDocuments.uploadedFiles.map((file) => file.name),
    );
    cy.clickSaveAndContinue();
  }

  cy.goToSiteAddressPage();
  cy.provideAddressLine1(appeal.appealSiteSection.siteAddress.addressLine1);
  cy.provideAddressLine2(appeal.appealSiteSection.siteAddress.addressLine2);
  cy.provideTownOrCity(appeal.appealSiteSection.siteAddress.town);
  cy.provideCounty(appeal.appealSiteSection.siteAddress.county);
  cy.providePostcode(appeal.appealSiteSection.siteAddress.postcode);
  cy.clickSaveAndContinue();

  cy.goToWholeSiteOwnerPage();
  if (appeal.appealSiteSection.siteOwnership.ownsWholeSite) {
    cy.answerOwnsTheWholeAppeal();
    cy.clickSaveAndContinue();
  } else {
    cy.answerDoesNotOwnTheWholeAppeal();
    cy.clickSaveAndContinue();

    if (appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold) {
      cy.answerDidToldOtherOwnersAppeal();
    } else {
      cy.answerDidNotToldOtherOwnersAppeal();
    }
    cy.clickSaveAndContinue();
  }

  cy.goToAccessSitePage();
  if (appeal.appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad) {
    cy.answerCanSeeTheWholeAppeal();
  } else {
    cy.answerCannotSeeTheWholeAppeal();
    cy.provideMoreDetails(appeal.appealSiteSection.siteAccess.howIsSiteAccessRestricted);
  }
  cy.clickSaveAndContinue();

  cy.goToHealthAndSafetyPage();
  if (appeal.appealSiteSection.healthAndSafety.hasIssues) {
    cy.answerSiteHasIssues();
    cy.provideSafetyIssuesConcerns(appeal.appealSiteSection.healthAndSafety.healthAndSafetyIssues);
  } else {
    cy.answerSiteHasNoIssues();
  }
  cy.clickSaveAndContinue();

  cy.wait(Cypress.env('demoDelay'));
};
