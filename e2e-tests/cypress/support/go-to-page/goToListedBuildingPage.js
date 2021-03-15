module.exports = () => {
  cy.visit('/eligibility/listed-building', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
