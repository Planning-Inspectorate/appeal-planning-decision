export const checkStatusForTask = (task, status) => {
  cy.get('[' + task.replace(/[ ]+/g, '').toLowerCase() + '-status="' + status + '"]').should(
    'have.length',
    1,
  );

  //cy.wait(Cypress.env('demoDelay'));
};
