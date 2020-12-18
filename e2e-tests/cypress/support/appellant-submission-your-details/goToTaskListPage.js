module.exports = () => {
  cy.visit('/appellant-submission/task-list');
  cy.wait(Cypress.env('demoDelay'));
};
