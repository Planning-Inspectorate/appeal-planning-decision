import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the user has not been in {string} section', () => {});

Given('the user {string} the original appellant', (original) => {
  cy.goToWhoAreYouPage();

  if (original === 'is') {
    cy.answerYesOriginalAppellant();
  } else {
    cy.answerNoOriginalAppellant();
  }

  cy.clickSaveAndContinue();
});

Given('the user has provided their name: {string} and email: {string}', (name, email) => {
  cy.provideDetailsName(name);
  cy.provideDetailsEmail(email);
  cy.clickSaveAndContinue();
});

Given('the user has provided {string} as the name of the original appellant', (applicantName) => {
  cy.goToApplicantNamePage();
  cy.provideApplicantName(applicantName);
  cy.clickSaveAndContinue();
});

When('the user checks the status of their appeal', (name, email) => {
  cy.goToTaskListPage();
});

Then('the user should see that the {string} task is {string}', (task, status) => {
  cy.checkStatusForTask(task, status);
});
