module.exports = () => {
  cy.get('[data-cy="cookies-with-js-heading"]').should('not.be.visible');

  const expectedHeading = 'Cookies on GOV.UK';

  cy.get(`[data-cy="cookies-without-js-heading"]`).should('be.visible').contains(expectedHeading);
  cy.wait(Cypress.env('demoDelay'));
};
