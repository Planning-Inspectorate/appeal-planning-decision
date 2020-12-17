module.exports = (answer, details) => {
  cy.goToAccessSitePage();

  cy.get('[data-cy="answer-' + answer + '"]')
    .first()
    .should('be.checked');

  if (answer === 'no') {
    cy.get('#site-access-more-detail').should('have.value', details);
  }

  cy.wait(Cypress.env('demoDelay'));
};
