export const confirmProviedLocalPlanningDepartmentWasAccepted = (text) => {
  cy.url().should('include', '/eligibility/listed-building');
};
