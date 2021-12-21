module.exports = (errorMessage) => {
  // confirm we are in the right place
  cy.url().should('include', '/appellant-submission/supporting-documents');

  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      if (!Array.isArray(errorMessage)) {
        errorMessage = [errorMessage];
      }
      errorMessage.forEach((errorMessage) => expect(text).to.contain(errorMessage));
    });
  // pause long enough to capture a nice video
  cy.wait(Cypress.env('demoDelay'));
};
