module.exports = (errorMessage) => {
  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      if (!Array.isArray(errorMessage)) {
        errorMessage = [errorMessage];
      }
      errorMessage.forEach((errorMessage) => expect(text).to.contain(errorMessage));
    });
  cy.title().should('include', 'Error: ')
  // pause long enough to capture a nice video
  cy.wait(Cypress.env('demoDelay'));
};
