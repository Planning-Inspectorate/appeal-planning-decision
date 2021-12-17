import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { STANDARD_APPEAL } from '../common/standard-appeal';
import { getTask } from '../common/task';
import '../common/cookies';

Given('a prospective appellant has provided valid appeal information', () => {
  cy.provideCompleteAppeal(STANDARD_APPEAL);
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

  cy.navigateToSubmissionInformationPage();

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
  });
});
