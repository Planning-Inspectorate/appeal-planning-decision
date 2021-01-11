module.exports = () => {
  cy.visit('/check-answers', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
