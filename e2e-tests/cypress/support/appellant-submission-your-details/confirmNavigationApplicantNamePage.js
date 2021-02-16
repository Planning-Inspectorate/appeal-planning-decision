module.exports = () => {
  cy.url().should('include', '/appellant-submission/applicant-name');
  cy.snapshot();
}
