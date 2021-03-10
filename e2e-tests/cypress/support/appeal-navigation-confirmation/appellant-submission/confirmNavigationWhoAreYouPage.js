module.exports = () => {
  cy.url().should('include', '/appellant-submission/original-applicant');
  cy.wait(Cypress.env('demoDelay'));
}
