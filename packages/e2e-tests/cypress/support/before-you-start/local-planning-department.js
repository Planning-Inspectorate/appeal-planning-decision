export const selectLocalPlanningDepartment = (lpdName) =>
  cy.get('#local-planning-department').type(`${lpdName}{downArrow}{enter}`);

export const viewLocalPlanningDepartment = () => cy.get('[id=local-planning-department]');
