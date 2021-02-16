module.exports = () => {
  cy.visit('/appellant-submission/appeal-statement', { failOnStatusCode: false });
  cy.snapshot();
};
