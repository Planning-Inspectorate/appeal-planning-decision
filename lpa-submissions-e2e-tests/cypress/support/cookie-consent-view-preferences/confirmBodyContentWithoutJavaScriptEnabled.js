module.exports = () => {
  cy.get('[data-cy="cookies-with-js-content"]').should('not.be.visible');

  const expectedText =
    'Unfortunately Javascript is not running on your browser, so you cannot change your settings';

  cy.get(`[data-cy="cookies-without-js-content"]`).should('be.visible').contains(expectedText);
  cy.wait(Cypress.env('demoDelay'));
};
