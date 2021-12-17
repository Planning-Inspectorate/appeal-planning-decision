module.exports = () => {
  cy.visit('/');
  cy.wait(Cypress.env('demoDelay'));
};
