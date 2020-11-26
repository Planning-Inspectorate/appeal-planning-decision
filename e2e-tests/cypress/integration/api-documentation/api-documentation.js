import { Given, When, Then } from "cypress-cucumber-preprocessor/steps"

const horizonDocumentation = Cypress.config('horizon-api-swagger');

When('I view the horizon-api documentation', () => {
  cy.visit(horizonDocumentation)
});

Then('I should see /adddocuments', () => {
  cy.get("#operations-default-AddDocument").should('exist');
});

Then('I should see /createcase', () => {
  cy.get("#operations-default-CreateCase").should('exist');
});