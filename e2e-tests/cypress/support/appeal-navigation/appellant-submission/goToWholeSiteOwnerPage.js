module.exports = () => {
  cy.visit('/appellant-submission/site-ownership', {failOnStatusCode: false});
  cy.snapshot();
};
