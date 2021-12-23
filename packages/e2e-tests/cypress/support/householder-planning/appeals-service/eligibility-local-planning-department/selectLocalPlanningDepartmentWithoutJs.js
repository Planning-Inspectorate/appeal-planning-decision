export const selectLocalPlanningDepartmentWithoutJs = (text) => {
  cy.get('[data-cy="local-planning-department"]').select(text);
};
