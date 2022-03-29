import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { uploadPlanningApplicationFile } from '../../../../../support/householder-planning/appeals-service/appellant-submission-upload-application/uploadPlanningApplicationFile';
import { clickSaveAndContinue } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { uploadDecisionLetterFile } from '../../../../../support/householder-planning/appeals-service/appellant-submission-decision-letter/uploadDecisionLetterFile';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../common/householder-planning/appeals-service/pageURLAppeal';
import {
  decisionLetter,
  originalApplication,
  planningApplicationNumber
} from "../../../../../support/householder-planning/appeals-service/page-objects/task-list-po";

Given('the "Application number" is presented', () => {
  planningApplicationNumber().click();
 cy.url().should('contain',pageURLAppeal.goToPlanningApplicationNumberPage);
});

Given('the "Upload application" is presented', () => {
  originalApplication().click();
  cy.url().should('contain',pageURLAppeal.goToPlanningApplicationSubmission);
});

Given('the "Upload decision letter" is presented', () => {
  decisionLetter().click();
  cy.url().should('contain',pageURLAppeal.goToDecisionLetterPage);
});

When('the "Application number" is submitted with valid values', () => {
  const planningApplicationNumber = 'ValidNumber/12345';

  cy.get('[data-cy="application-number"]').clear().type(planningApplicationNumber);
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
