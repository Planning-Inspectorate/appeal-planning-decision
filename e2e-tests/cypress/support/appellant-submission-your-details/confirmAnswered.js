module.exports = (answer) => {
  cy.goToWhoAreYouPage();
  cy.get('[data-cy="answer-' + answer + '"]')
    .first()
    .should('be.checked');
  cy.wait(Cypress.env('demoDelay'));
};
