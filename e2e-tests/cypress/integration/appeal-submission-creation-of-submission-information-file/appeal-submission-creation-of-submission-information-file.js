import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('a prospective appellant has provided valid appeal information', () => {
  cy.provideCompleteAppeal();
  cy.clickCheckYourAnswers();

  // /appellant-submission/check-answers
  cy.clickSaveAndContinue();
});

When('the appeal is submitted', () => {
  cy.confirmNavigationTermsAndConditionsPage();

  // /appellant-submission/submission
  cy.agreeToTheDeclaration();
});

Then('a submission information file is created', () => {
  // /appellant-submission/confirmation
  cy.confirmAppealSubmitted();

  cy.goToSubmissionInformationPage();

  cy.confirmSubmissionInformationDisplayItems({
    'who-are-you': 'Yes',
    'appellant-name': 'Valid Name',
    'appellant-email': 'valid@email.com',
    'application-number': 'ValidNumber/12345',
    'upload-application': 'appeal-statement-valid.doc',
    'upload-decision': 'appeal-statement-valid.doc',
    'appeal-statement': 'appeal-statement-valid.doc',
    'supporting-documents-no-files': 'No files uploaded',
    'site-location': '1 Taylor Road\nClifton\nBristol\nSouth Glos\nBS8 1TG',
    'site-ownership': 'Yes',
    'site-access': 'Yes',
    'site-access-safety': 'No',
    'supporting-documents-uploaded-file-count-heading': '3 files uploaded',
    'supporting-documents-uploaded-file-0': 'appeal-statement-valid.pdf',
    'supporting-documents-uploaded-file-1': 'appeal-statement-valid.docx',
    'supporting-documents-uploaded-file-2': 'appeal-statement-valid.doc',
  });
});
