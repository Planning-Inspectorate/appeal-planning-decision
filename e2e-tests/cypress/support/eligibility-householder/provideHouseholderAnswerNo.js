module.exports = () => {
  cy.get('[data-cy="answer-no"]').click();
  cy.snapshot();
};
