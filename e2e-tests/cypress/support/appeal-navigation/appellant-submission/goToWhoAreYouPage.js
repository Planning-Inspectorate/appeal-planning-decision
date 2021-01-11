module.exports = () => {
  cy.visit('/appellant-submission/who-are-you', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
