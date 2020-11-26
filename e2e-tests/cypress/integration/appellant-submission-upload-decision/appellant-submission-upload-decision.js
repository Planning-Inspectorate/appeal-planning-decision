import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('user submits a upload decision file {string}', (filename) => {
  cy.goToPlanningApplicationSubmission();
  cy.uploadPlanningApplicationFile(filename);
});

When('The application file {string} is submitted and user can proceed', (filename) => {
  cy.saveAndContinue();
  cy.confirmPlanningApplicationAccepted(filename);
});

Then('user is informed that the file is not submitted because {string}', (reason) => {
  cy.saveAndContinue();

  switch (reason) {
    case 'file type is invalid':
      cy.confirmPlanningApplicationRejectedBecause('Doc is the wrong file type');
      break;
    case 'file size exceeds limit':
      cy.confirmPlanningApplicationRejectedBecause('The file must be smaller than');
      break;
  }
});
