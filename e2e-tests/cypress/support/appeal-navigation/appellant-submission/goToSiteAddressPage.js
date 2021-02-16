module.exports = () => {
  cy.visit('/appellant-submission/site-location', {failOnStatusCode: false});
  cy.snapshot();
};
