module.exports = (planningDepartment) => {
  cy.goToPlanningDepartmentPage();
  cy.get('input#planning-department-label').should('have.value', planningDepartment);
  cy.wait(Cypress.env('demoDelay'));

  cy.goToCheckYourAnswersPage();
  cy.get('[data-cy="local-planning-department"]').first().should('contain', planningDepartment);
  cy.wait(Cypress.env('demoDelay'));
};
