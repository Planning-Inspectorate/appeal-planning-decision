module.exports = () => {
  cy.visit('/cookies');
  cy.wait(Cypress.env('demoDelay'));
};
