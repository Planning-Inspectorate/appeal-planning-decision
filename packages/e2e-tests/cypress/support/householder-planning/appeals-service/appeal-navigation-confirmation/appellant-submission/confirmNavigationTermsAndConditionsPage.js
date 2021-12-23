export const confirmNavigationTermsAndConditionsPage = () => {
  cy.url().should('include', '/appellant-submission/submission');
  cy.wait(Cypress.env('demoDelay'));
}
