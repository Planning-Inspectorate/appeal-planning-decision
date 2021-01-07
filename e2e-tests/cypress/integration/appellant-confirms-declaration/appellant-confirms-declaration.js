import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('an appeal is ready to be submitted', () => {});
When('the declaration is not agreed', () => {
  cy.doNotAgreeToTheDeclaration();
});
When('the declaration is agreed', () => {
  cy.agreeToTheDeclaration();
});

Then('the submission confirmation is presented', () => {
  cy.confirmAppealSubmitted();
});

Then('no submission confirmation is presented', () => {
  cy.confirmAppealNotSubmitted();
  cy.confirmDeclarationAreRequired();
});
