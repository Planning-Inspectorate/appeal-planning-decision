module.exports = () => {
  cy.visit('/appellant-submission/site-access-safety', {failOnStatusCode: false});
  cy.snapshot();
};
