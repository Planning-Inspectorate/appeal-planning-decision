module.exports = () => {
  cy.get('#does-not-include-sensitive-information').check();
  cy.wait(Cypress.env('demoDelay'));
};
