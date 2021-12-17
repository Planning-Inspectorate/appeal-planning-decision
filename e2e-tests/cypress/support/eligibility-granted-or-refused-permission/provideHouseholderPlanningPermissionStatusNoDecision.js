module.exports = () => {
  cy.get('[data-cy="answer-nodecisionreceived"]').click();
  cy.wait(Cypress.env('demoDelay'));
}
