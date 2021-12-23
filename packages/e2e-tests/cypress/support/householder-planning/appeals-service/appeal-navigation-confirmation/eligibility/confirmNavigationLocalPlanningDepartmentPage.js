export const confirmNavigationLocalPlanningDepartmentPage = () => {
  cy.url().should('include', '/eligibility/planning-department');
  //cy.wait(Cypress.env('demoDelay'));
}
