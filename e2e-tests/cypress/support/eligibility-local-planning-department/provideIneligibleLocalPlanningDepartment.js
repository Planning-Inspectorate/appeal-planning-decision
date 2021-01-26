module.exports = () => {
  cy.get('[data-cy="ineligible-departments"]').invoke('text')
    .then((departments) => {
      let firstIneligibleLocalPlanningDepartment = '';
      const ineligiblePlanningDepartments = departments.toString().split(',');
      if (ineligiblePlanningDepartments.length > 0) {
        firstIneligibleLocalPlanningDepartment = ineligiblePlanningDepartments[0];
      }
      cy.get('input#planning-department-label').type(`{selectall}{backspace}${firstIneligibleLocalPlanningDepartment}`);
      cy.wait(Cypress.env('demoDelay'));
    })
}
