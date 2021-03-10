module.exports = () => {
  cy.visit('/appeal-householder-decision/address-appeal-site', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
