export const confirmNavigationDecisionDatePage = () => {
  cy.url().should('include', '/eligibility/decision-date');
  //cy.wait(Cypress.env('demoDelay'));
}
