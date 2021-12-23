export const confirmNavigationCostsPage = () => {
  cy.url().should('include', '/eligibility/costs');
  //cy.wait(Cypress.env('demoDelay'));
}
