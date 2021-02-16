module.exports = () => {
  cy.visit('/page-not-found', {failOnStatusCode: false});
  cy.snapshot();
};
