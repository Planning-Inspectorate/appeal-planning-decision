module.exports = () => {
  cy.get('[data-cy="answer-yes"]').click();
  cy.snapshot();
};
