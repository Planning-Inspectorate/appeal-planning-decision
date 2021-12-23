export const confirmNavigationListedBuildingPage = () => {
  cy.url().should('include', '/eligibility/listed-building');
  //cy.wait(Cypress.env('demoDelay'));
}
