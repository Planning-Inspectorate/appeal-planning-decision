module.exports = () => {
  cy.get('#site-ownership').click();

  cy.wait(Cypress.env('demoDelay'));
};
