module.exports = () => {
  cy.visit('/appellant-submission/application-number', {failOnStatusCode: false});
  cy.snapshot();
};
