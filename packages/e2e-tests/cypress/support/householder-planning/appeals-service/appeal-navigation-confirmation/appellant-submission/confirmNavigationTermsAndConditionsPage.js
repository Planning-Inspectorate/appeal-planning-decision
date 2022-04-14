export const confirmNavigationTermsAndConditionsPage = () => {
  cy.url().should('include', '/appellant-submission/submission');
}
