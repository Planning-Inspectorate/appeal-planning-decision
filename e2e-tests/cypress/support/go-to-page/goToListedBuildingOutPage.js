module.exports = () => {
  cy.visit('/eligibility/listed-building-out', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
