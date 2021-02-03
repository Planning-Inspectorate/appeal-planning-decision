module.exports = () => {
  cy.url().should('include', '/eligibility/decision-date-passed');
  cy.wait(Cypress.env('demoDelay'));
}
