module.exports = () => {
  cy.visit('/submission');
  cy.wait(Cypress.env('demoDelay'));
};
