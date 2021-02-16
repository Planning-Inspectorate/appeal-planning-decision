module.exports = () => {
  cy.visit('/appellant-submission/upload-application', {failOnStatusCode: false});
  cy.snapshot();
};
