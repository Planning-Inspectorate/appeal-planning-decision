export const provideLocalPlanningDepartment = (text) => {
  cy.get('input#local-planning-department').type(`{selectall}{backspace}${text}`);
};
