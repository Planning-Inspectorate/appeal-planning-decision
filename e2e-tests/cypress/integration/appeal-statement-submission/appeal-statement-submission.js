// These steps are merely placeholders while the approach and structure is agreed in the team.
// They are not called in CI because the feature file is tagged as @wip.
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I have an appeal statement file {string} {string} sensitive information', (filename, info) => {
  cy.log('I have an appeal statement file {string} {string} sensitive information');
  cy.log(filename);
  cy.log(info);
  cy.visit('/');
});

When('I submit the appeal statement file', () => {
  cy.log('I submit the appeal statement file');
  cy.visit('/');
});

Then('I can see that the file {string} {string} submitted', (filename, submitted) => {
  cy.log('I can see that the file {string} {string} submitted');
  cy.log(filename);
  cy.log(submitted);
  cy.visit('/');
});

Then('I am informed why the file is not submitted', () => {
  cy.log('I am informed why the file is not submitted');
  cy.visit('/');
});

And('I have previously submitted an appeal statement file {string}', (filename) => {
  cy.log(filename);
  cy.log('I have previously submitted an appeal statement file');
  cy.visit('/');
});
