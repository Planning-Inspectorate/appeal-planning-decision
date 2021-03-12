module.exports = () => {
  cy.visit('/appeal-householder-decision/check-answers', { failOnStatusCode: false });
  cy.wait(Cypress.env('demoDelay'));
};
