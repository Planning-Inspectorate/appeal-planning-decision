export const confirmBodyContentWithJavaScriptEnabled = () => {
  cy.get('[data-cy="cookies-without-js-content"]').should('not.be.visible');

  const expectedText =
    'We use Google Analytics to measure how you use the appeal a householder planning decision service so we can improve it based on user needs.';

  cy.get(`[data-cy="cookies-with-js-content"]`).should('be.visible').contains(expectedText);
};
