module.exports = () => {
  cy.visit('/appellant-submission/task-list', {failOnStatusCode: false});
  cy.snapshot();
};
