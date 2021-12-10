export const goToLocalPlanningDepartment = () =>{
  cy.visit('/eligibility/local-planning-depart');
  cy.checkPageA11y(context, null, callback);
}
