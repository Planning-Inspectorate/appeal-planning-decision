module.exports = () => {
  cy.url().should('include', '/eligibility/decision-date-expired');
  cy.wait(Cypress.env('demoDelay'));
}
