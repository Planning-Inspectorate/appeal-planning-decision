module.exports = ({ chosenLocalPlanningDepartment = undefined } = {}) => {
  cy.get('[data-cy="eligible-departments"]')
    .invoke('text')
    .then((departments) => {
      let lpd;

      if (chosenLocalPlanningDepartment) {
        lpd = chosenLocalPlanningDepartment;
      } else {
        const eligiblePlanningDepartments = departments.toString().split(',');
        if (eligiblePlanningDepartments.length > 0) {
          lpd = eligiblePlanningDepartments[0];
        }
      }

      if (!lpd || lpd === '') {
        throw new Error('LPD was not set.');
      }
      cy.get('[data-cy="local-planning-department"]').select(lpd);
      cy.wait(Cypress.env('demoDelay'));
    });
};
