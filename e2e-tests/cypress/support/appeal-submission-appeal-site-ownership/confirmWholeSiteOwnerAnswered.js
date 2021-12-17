module.exports = (answer) => {
  cy.goToWholeSiteOwnerPage();

  if (answer === 'blank') {
    cy.get('[data-cy="answer-yes"]').first().should('not.be.checked');
    cy.get('[data-cy="answer-no"]').first().should('not.be.checked');
  } else {
    cy.get('[data-cy="answer-' + answer + '"]')
      .first()
      .should('be.checked');
  }

  cy.wait(Cypress.env('demoDelay'));
};
