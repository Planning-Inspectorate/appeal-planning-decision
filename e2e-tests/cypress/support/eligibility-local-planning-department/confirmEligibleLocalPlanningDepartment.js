module.exports = () => {
  cy.get('[data-cy="eligible-departments"]').invoke('text')
    .then((departments) => {
      let firstEligibleLocalPlanningDepartment = '';
      const eligiblePlanningDepartments = departments.toString().split(',');
      if (eligiblePlanningDepartments.length > 0) {
        firstEligibleLocalPlanningDepartment = eligiblePlanningDepartments[0];
      }

      cy.goToPlanningDepartmentPage();
      cy.get('input#planning-department-label').should('have.value', firstEligibleLocalPlanningDepartment);
      cy.snapshot();

      cy.goToCheckYourAnswersPage();
      cy.get('[data-cy="local-planning-department"]').first().should('contain', firstEligibleLocalPlanningDepartment);
      cy.snapshot();
    })
}
