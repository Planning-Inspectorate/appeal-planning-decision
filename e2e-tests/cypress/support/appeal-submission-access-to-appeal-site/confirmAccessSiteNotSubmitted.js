module.exports = () => {
  cy.goToAccessSitePage();

  cy.get('[data-cy="answer-yes"]').first().should('not.be.checked');
  cy.get('[data-cy="answer-no"]').first().should('not.be.checked');

  cy.wait(Cypress.env('demoDelay'));
};

