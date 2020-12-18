import { When, Then } from 'cypress-cucumber-preprocessor/steps';

When('the user provides the name {string}', (name) => {
  cy.goToApplicantNamePage();
  cy.provideApplicantName(name);
  cy.clickSaveAndContinue();
});

When('the user does not provides the name', () => {
  cy.goToApplicantNamePage();
  cy.clickSaveAndContinue();
});

Then('the user can proceed', () => {
  cy.confirmApplicantNameWasAccepted();
});

When('the user is informed that the name is missing', () => {
  cy.confirmApplicantNameWasRejected('Enter the name you are appealing for');
});

Then('the user is informed that the provided name has a bad format', () => {
  cy.confirmApplicantNameWasRejected(
    'Name must only include letters a to z, hyphens, spaces and apostrophes',
  );
});

Then(
  'the user can see that their appeal has {string} updated with the provided name {string}',
  (updated, name) => {
    if (updated === 'been') {
      cy.confirmApplicantNameValue(name);
    } else {
      cy.confirmApplicantNameValue('');
    }
  },
);
