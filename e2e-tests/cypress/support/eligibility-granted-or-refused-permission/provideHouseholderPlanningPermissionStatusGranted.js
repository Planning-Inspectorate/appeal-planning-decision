module.exports = () => {
  cy.get('[data-cy="answer-granted"]').click();
  cy.wait(Cypress.env('demoDelay'));
}
