import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

const horizonDocumentation = Cypress.config('horizon-api-swagger');
const appealsDocumentation = Cypress.config('appeals-api-swagger');

When('I view the horizon-api documentation', () => {
  cy.visit(horizonDocumentation)
});

Then('I should see //adddocuments', () => {
  cy.get('#operations-default-AddDocument').should('exist');
});

Then('I should see //createcase', () => {
  cy.get('#operations-default-CreateCase').should('exist');
});

When('I view the appeals-api documentation', () => {
  cy.visit(appealsDocumentation)
});

Then('I should see GET //appeals', () => {
  cy.get('#operations-Appeals-get_appeals').should('exist');
});

Then('I should see POST //appeals', () => {
    cy.get('#operations-Appeals-post_appeals').should('exist');
});

Then('I should see GET //appeals//uuid', () => {
    cy.get('#operations-Appeals-get_appeals__uuid_').should('exist');
});

Then('I should see DELETE //appeals//uuid', () => {
    cy.get('#operations-Appeals-delete_appeals__uuid_').should('exist');
});

Then('I should see PUT //appeals//uuid', () => {
    cy.get('#operations-Appeals-put_appeals__uuid_').should('exist');
});

Then('I should see GET //local-planning-authorities', () => {
    cy.get('#operations-Local_Planning_Authorities-get_local_planning_authorities').should('exist');
});

Then('I should see GET //local-planning-authorities//id', () => {
    cy.get('#operations-Local_Planning_Authorities-get_local_planning_authorities').should('exist');
});
