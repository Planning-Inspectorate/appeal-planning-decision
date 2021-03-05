module.exports = (planningDepartment) => {
  cy.goToPlanningDepartmentPage();
  cy.get('input#local-planning-department').should('have.value', planningDepartment);
  cy.wait(Cypress.env('demoDelay'));

  cy.goToCheckYourAnswersPage();
  cy.get('[data-cy="local-planning-department"]').first().should('contain', planningDepartment);
  cy.wait(Cypress.env('demoDelay'));
};
