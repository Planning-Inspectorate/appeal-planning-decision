module.exports = () => {
  cy.get('[data-cy="eligible-departments"]').invoke('text')
    .then((departments) => {
      let firstEligibleLocalPlanningDepartment = '';
      const eligiblePlanningDepartments = departments.toString().split(',');
      if (eligiblePlanningDepartments.length > 0) {
        firstEligibleLocalPlanningDepartment = eligiblePlanningDepartments[0];
      }
      cy.get('input#local-planning-department').type(`{selectall}{backspace}${firstEligibleLocalPlanningDepartment}`);
      cy.wait(Cypress.env('demoDelay'));
    })
}
