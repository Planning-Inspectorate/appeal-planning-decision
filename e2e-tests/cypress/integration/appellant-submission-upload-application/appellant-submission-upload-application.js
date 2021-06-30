import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';


Given('user did not previously submitted a planning application file',() => {})

Given('user has previously submitted a planning application file {string}', (filename) => {
  cy.goToPlanningApplicationSubmission();
  cy.uploadPlanningApplicationFile(filename);
  cy.clickSaveAndContinue();
});

Given(
  'user has previously submitted a valid planning application file {string} followed by an invalid file {string} that was rejected because {string}',
  (validFile, invalidFile, reason) => {
    cy.goToPlanningApplicationSubmission();
    cy.uploadPlanningApplicationFile(validFile);
    cy.clickSaveAndContinue();
    cy.goToPlanningApplicationSubmission();
    cy.uploadPlanningApplicationFile(invalidFile);
    cy.clickSaveAndContinue();

    switch (reason) {
      case 'file type is invalid':
        cy.confirmPlanningApplicationRejectedBecause('The selected file must be a');
        break;
      case 'file size exceeds limit':
        cy.confirmPlanningApplicationRejectedBecause('The file must be smaller than');
        break;
    }
  },
);

When('user submits a planning application file {string}', (filename) => {
  cy.goToPlanningApplicationSubmission();
  cy.uploadPlanningApplicationFile(filename);
  cy.clickSaveAndContinue();
});

When('user does not submit a planning application file', () => {
  cy.goToPlanningApplicationSubmission();
  cy.clickSaveAndContinue();
});

Then('application file {string} is submitted and user can proceed', (filename) => {
  cy.confirmPlanningApplicationAccepted(filename);
});

Then('user can see that no planning application file is submitted', (reason) => {
  cy.confirmPlanningApplicationIsNotUploaded();
});

Then(
  'user can see that the planning application file {string} {string} submitted',
  (filename, submitted) => {
    cy.goToPlanningApplicationSubmission();

    if (submitted === 'is') {
      cy.confirmPlanningApplicationFileIsUploaded(filename);
      cy.confirmThatNoErrorTriggered();
    } else {
      cy.confirmPlanningApplicationIsNotUploaded();
    }
  },
);


Then('user is informed that he needs to upload a planning application file', () => {
  cy.confirmPlanningApplicationRejectedBecause('Select a planning application form');
})

Then(
  'user is informed that the planning application file is not submitted because {string}',
  (reason) => {
    switch (reason) {
      case 'file type is invalid':
        cy.confirmPlanningApplicationRejectedBecause('The selected file must be a');
        break;
      case 'file size exceeds limit':
        cy.confirmPlanningApplicationRejectedBecause('The file must be smaller than');
        break;
    }
  },
);
