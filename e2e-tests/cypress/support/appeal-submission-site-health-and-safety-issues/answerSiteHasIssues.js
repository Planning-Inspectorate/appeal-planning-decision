module.exports = () => {
  cy.get('#site-access-safety').click();
  cy.wait(Cypress.env('demoDelay'));
};
