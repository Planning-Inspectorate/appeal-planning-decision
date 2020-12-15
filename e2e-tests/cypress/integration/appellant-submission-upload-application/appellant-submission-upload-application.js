import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('user submits a planning application file {string}', (filename) => {
  cy.goToPlanningApplicationSubmission();
  cy.uploadPlanningApplicationFile(filename);
});

Given('user does not submits a planning application file', () => {
  cy.goToPlanningApplicationSubmission();
});

Given('user has previously submitted a planning application file {string}', (filename) => {
  cy.goToPlanningApplicationSubmission();
  cy.uploadPlanningApplicationFile(filename);
  cy.saveAndContinue();
});

When('The application file {string} is submitted and user can proceed', (filename) => {
  cy.saveAndContinue();
  cy.confirmPlanningApplicationAccepted(filename);
});

Then('user can see that no planning application file is submitted', (reason) => {
  cy.saveAndContinue();
  cy.confirmPlanningApplicationRejectedBecause('Upload the planning application form');
});

Then('user can see that the planning application file {string} "is" submitted', (filename) => {
  cy.saveAndContinue();
  cy.confirmPlanningApplicationAccepted(filename);
});

Then(
  'user is informed that the planning application file is not submitted because {string}',
  (reason) => {
    cy.saveAndContinue();

    switch (reason) {
      case 'file type is invalid':
        cy.confirmPlanningApplicationRejectedBecause('Doc is the wrong file type');
        break;
      case 'file size exceeds limit':
        cy.confirmPlanningApplicationRejectedBecause('The file must be smaller than');
        break;
    }
  },
);
