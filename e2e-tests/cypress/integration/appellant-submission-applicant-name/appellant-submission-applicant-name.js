import { When, Then } from 'cypress-cucumber-preprocessor/steps';

When('the user provides the name', () => {
  cy.goToApplicantNamePage();
  cy.provideApplicantName('Good Name');
});

When('the user provides the name with a bad format', () => {
  cy.goToApplicantNamePage();
  cy.provideApplicantName('B@d Name');
});

When('the user does not provides the name', () => {
  cy.goToApplicantNamePage();
});

Then('the user can proceed', () => {
  cy.confirmApplicantNameWasAccepted();
});

When('the user is informed that the name is missing', () => {
  cy.confirmApplicantNameWasRejected('Enter the name your appealing for');
});

Then('the user is informed that the provided name has a bad format', () => {
  cy.confirmApplicantNameWasRejected(
    'Name must only include letters a to z, hyphens, spaces and apostrophes',
  );
});
