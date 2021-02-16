module.exports = () => {
  cy.url().should('include', '/appellant-submission/task-list');
  cy.snapshot();
};
