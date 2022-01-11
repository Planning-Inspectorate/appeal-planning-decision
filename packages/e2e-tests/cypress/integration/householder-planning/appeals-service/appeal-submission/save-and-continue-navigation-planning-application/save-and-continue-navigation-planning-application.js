import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { uploadPlanningApplicationFile } from '../../../../../support/householder-planning/appeals-service/appellant-submission-upload-application/uploadPlanningApplicationFile';
import { clickSaveAndContinue } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { uploadDecisionLetterFile } from '../../../../../support/householder-planning/appeals-service/appellant-submission-decision-letter/uploadDecisionLetterFile';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('the "Application number" is presented', () => {
  //goToPlanningApplicationNumberPage();
  goToAppealsPage(pageURLAppeal.goToPlanningApplicationNumberPage);
});

Given('the "Upload application" is presented', () => {
  //goToPlanningApplicationSubmission();
  goToAppealsPage(pageURLAppeal.goToPlanningApplicationSubmission);
});

Given('the "Upload decision letter" is presented', () => {
  //goToDecisionLetterPage();
  goToAppealsPage(pageURLAppeal.goToDecisionLetterPage);
});

When('the "Application number" is submitted with valid values', () => {
  const planningApplicationNumber = 'ValidNumber/12345';

  cy.get('[data-cy="application-number"]').type(
    `{selectall}{backspace}${planningApplicationNumber}`,
  );
  //wait(Cypress.env('demoDelay'));
  cy.get('[data-cy="button-save-and-continue"]').click();
 // wait(Cypress.env('demoDelay'));
});

When('the "Upload application" is submitted with valid values', () => {
  uploadPlanningApplicationFile('appeal-statement-valid.doc');
  clickSaveAndContinue();
});

When('the "Upload decision letter" is submitted with valid values', () => {
  uploadDecisionLetterFile('appeal-statement-valid.doc');
  clickSaveAndContinue();
});
