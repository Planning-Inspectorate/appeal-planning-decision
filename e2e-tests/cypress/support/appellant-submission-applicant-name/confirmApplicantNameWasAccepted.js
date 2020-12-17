module.exports = () => {
  // confirm we are in the right place
  cy.url().should('include', '/appellant-submission/task-list');

  // pause long enough to capture a nice video
  cy.wait(Cypress.env('demoDelay'));
};
