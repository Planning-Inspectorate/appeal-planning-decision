module.exports = () => {
  cy.visit('/eligibility/listed-out', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
