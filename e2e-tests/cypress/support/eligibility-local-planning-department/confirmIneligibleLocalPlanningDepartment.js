module.exports = () => {
  cy.get('[data-cy="ineligible-departments"]').invoke('text')
    .then((departments) => {
      let firstIneligibleLocalPlanningDepartment = '';
      const ineligiblePlanningDepartments = departments.toString().split(',');
      if (ineligiblePlanningDepartments.length > 0) {
        firstIneligibleLocalPlanningDepartment = ineligiblePlanningDepartments[0];
      }

      cy.goToPlanningDepartmentPage();
      cy.get('input#local-planning-department').should('have.value', firstIneligibleLocalPlanningDepartment);
      cy.wait(Cypress.env('demoDelay'));

      cy.goToCheckYourAnswersPage();
      cy.get('[data-cy="local-planning-department"]').first().should('contain', firstIneligibleLocalPlanningDepartment);
      cy.wait(Cypress.env('demoDelay'));
    })
}
