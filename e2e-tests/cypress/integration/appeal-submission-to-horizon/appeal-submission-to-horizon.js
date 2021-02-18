import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
const { APPEAL_DOCUMENT } = require('../../../../packages/forms-web-app/src/lib/empty-appeal');

Given('a prospective appellant has provided valid appeal information', () => {
  cy.provideCompleteAppeal();
  cy.clickCheckYourAnswers();

  // /appellant-submission/check-answers
  cy.clickSaveAndContinue();
});

When('the appeal is submitted', () => {
  cy.confirmNavigationTermsAndConditionsPage();

  cy.task('listenToQueue');

  // /appellant-submission/submission
  cy.agreeToTheDeclaration();
});

Then('a case is created for a case officer', () => {
  // /appellant-submission/confirmation
  cy.confirmAppealSubmitted();

  cy.task('getLastFromQueue').then((actualMessage) => {
    const expected = require('./ucd-831-ac1.json');

    const expectedNoDynamicFields = {
      ...expected,
    };
    delete expectedNoDynamicFields.appeal.createdAt;
    delete expectedNoDynamicFields.appeal.updatedAt;
    delete expectedNoDynamicFields.appeal.id;
    delete expectedNoDynamicFields.appeal.yourAppealSection.appealStatement.uploadedFile.id;
    delete expectedNoDynamicFields.appeal.yourAppealSection.appealStatement.uploadedFile.location;
    delete expectedNoDynamicFields.appeal.requiredDocumentsSection.originalApplication.uploadedFile.id;
    delete expectedNoDynamicFields.appeal.requiredDocumentsSection.originalApplication.uploadedFile
      .location;
    delete expectedNoDynamicFields.appeal.requiredDocumentsSection.decisionLetter.uploadedFile.id;
    delete expectedNoDynamicFields.appeal.requiredDocumentsSection.decisionLetter.uploadedFile.location;

    const actualNoDynamicFields = {
      ...actualMessage,
    };

    delete actualNoDynamicFields._id;
    delete actualNoDynamicFields.uuid;
    delete actualNoDynamicFields.appeal.createdAt;
    delete actualNoDynamicFields.appeal.updatedAt;
    delete actualNoDynamicFields.appeal.id;
    delete actualNoDynamicFields.appeal.yourAppealSection.appealStatement.uploadedFile.id;
    delete actualNoDynamicFields.appeal.yourAppealSection.appealStatement.uploadedFile.location;
    delete actualNoDynamicFields.appeal.requiredDocumentsSection.originalApplication.uploadedFile.id;
    delete actualNoDynamicFields.appeal.requiredDocumentsSection.originalApplication.uploadedFile.location;
    delete actualNoDynamicFields.appeal.requiredDocumentsSection.decisionLetter.uploadedFile.id;
    delete actualNoDynamicFields.appeal.requiredDocumentsSection.decisionLetter.uploadedFile.location;

    expect(JSON.stringify(actualNoDynamicFields)).to.equal(JSON.stringify(expectedNoDynamicFields));
  });
});
