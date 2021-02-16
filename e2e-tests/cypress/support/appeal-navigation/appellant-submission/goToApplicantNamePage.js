module.exports = () => {
  cy.visit('/appellant-submission/applicant-name', {failOnStatusCode: false});
  cy.snapshot();
};
