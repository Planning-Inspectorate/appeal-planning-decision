import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToAppealsPage } from '../../support/common/go-to-page/goToAppealsPage';

const localPlanningDepartmentUrl = 'before-you-start/local-planning-depart';

Given('the user wants to start an appeal from a random page', () => {
  return true;
});

Given('the user has started an appeal and not yet selected an appeal type', () => {
  return true;
});

When('they manually go to the {string} page', (url) => {
  goToAppealsPage(url);
});

When('they are taken to the {string} page', (url) => {
  goToAppealsPage(url);
});

Then("they are redirected back to the first question", () => {
  cy.url().should('contain', localPlanningDepartmentUrl);
});

Then('they are not redirected back to the first question and remain on the {string} page', (url) => {
  cy.url().should('contain', url);
});
