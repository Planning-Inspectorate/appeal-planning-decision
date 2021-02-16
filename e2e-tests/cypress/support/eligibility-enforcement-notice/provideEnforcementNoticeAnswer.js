module.exports = (answer) => {
  if (typeof answer === 'boolean') {
    if (answer) {
      cy.get('[data-cy="answer-yes"]').click();
    } else {
      cy.get('[data-cy="answer-no"]').click();
    }
  }
  cy.snapshot();

  cy.get('[data-cy="button-save-and-continue"]').click();

  cy.snapshot();
};
