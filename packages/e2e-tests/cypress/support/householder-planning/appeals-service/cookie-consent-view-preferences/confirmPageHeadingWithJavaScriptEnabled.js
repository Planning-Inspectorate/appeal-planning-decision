export const confirmPageHeadingWithJavaScriptEnabled = () => {
  cy.get('[data-cy="cookies-without-js-heading"]').should('not.be.visible');

  const expectedHeading = 'Change your cookie settings';

  cy.get(`[data-cy="cookies-with-js-heading"]`).should('be.visible').contains(expectedHeading);

};
