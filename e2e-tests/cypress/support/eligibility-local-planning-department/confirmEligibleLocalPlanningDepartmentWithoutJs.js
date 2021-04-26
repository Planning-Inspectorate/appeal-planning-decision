module.exports = () => {
  cy.get('[data-cy="eligible-departments"]').invoke('text')
    .then((departments) => {
      let lastEligibleLocalPlanningDepartment = '';
      const eligiblePlanningDepartments = departments.toString().split(',');
      if (eligiblePlanningDepartments.length > 0) {
        lastEligibleLocalPlanningDepartment = eligiblePlanningDepartments[eligiblePlanningDepartments.length-1];
      }

      cy.goToPlanningDepartmentPageWithoutJs();
      cy.get('[data-cy="local-planning-department"]').should('have.value', lastEligibleLocalPlanningDepartment);
      cy.wait(Cypress.env('demoDelay'));

      cy.goToCheckYourAnswersPage();
      cy.get('[data-cy="local-planning-department"]').first().should('contain', lastEligibleLocalPlanningDepartment);
      cy.wait(Cypress.env('demoDelay'));
    })
}
