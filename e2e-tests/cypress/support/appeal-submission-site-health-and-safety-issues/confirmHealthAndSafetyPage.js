module.exports = () => {
  cy.url().should('contain', '/appeal-householder-decision/site-access-safety');
  cy.wait(Cypress.env('demoDelay'));
};
