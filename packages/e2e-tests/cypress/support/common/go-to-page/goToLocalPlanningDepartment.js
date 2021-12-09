export const goToLocalPlanningDepartment = () =>{
  cy.visit('/before-you-start/local-planning-depart');
  cy.checkPageA11y(context, null, callback);
}
