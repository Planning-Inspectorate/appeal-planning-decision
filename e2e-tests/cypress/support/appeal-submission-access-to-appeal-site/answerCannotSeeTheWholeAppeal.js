module.exports = () => {
  cy.get('#site-access-2').click();

  cy.wait(Cypress.env('demoDelay'));
};
