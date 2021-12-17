module.exports = () => {
  cy.get('#site-access').click();

  cy.wait(Cypress.env('demoDelay'));
};
