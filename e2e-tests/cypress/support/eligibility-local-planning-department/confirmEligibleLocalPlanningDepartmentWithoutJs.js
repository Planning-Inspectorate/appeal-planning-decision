module.exports = () => {
  cy.get('[data-cy="eligible-departments"]').invoke('text')
    .then((departments) => {
      let firstEligibleLocalPlanningDepartment = '';
      const eligiblePlanningDepartments = departments.toString().split(',');
      if (eligiblePlanningDepartments.length > 0) {
        firstEligibleLocalPlanningDepartment = eligiblePlanningDepartments[0];
      }

      cy.goToPlanningDepartmentPageWithoutJs();
      cy.get('[data-cy="local-planning-department"]').should('have.value', firstEligibleLocalPlanningDepartment);
      cy.wait(Cypress.env('demoDelay'));

      cy.goToCheckYourAnswersPage();
      cy.get('[data-cy="local-planning-department"]').first().should('contain', firstEligibleLocalPlanningDepartment);
      cy.wait(Cypress.env('demoDelay'));
    })
}
