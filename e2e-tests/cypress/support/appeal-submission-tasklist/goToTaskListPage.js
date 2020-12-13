module.exports = () => {
  // go to the right page
  cy.visit('/appellant-submission/task-list');
  cy.wait(Cypress.env('demoDelay'));
};
