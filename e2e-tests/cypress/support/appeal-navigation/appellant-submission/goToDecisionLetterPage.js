module.exports = () => {
  cy.visit('/appellant-submission/upload-decision', {failOnStatusCode: false});
  cy.snapshot();
};
