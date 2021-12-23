export const confirmDecisionLetterRejectedBecause = (errorMessage) => {
  // confirm we are in the right place
  cy.url().should('include', '/appellant-submission/upload-decision');

  cy.title().should('match', /^Error: /);

  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      if (!Array.isArray(errorMessage)) {
        errorMessage = [errorMessage];
      }
      errorMessage.forEach((errorMessage) => expect(text).to.contain(errorMessage));
    });
};
