module.exports = (errorMessage) => {
  cy.url().should('include', '/appeal-householder-decision/applicant-name');
  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      if (!Array.isArray(errorMessage)) {
        errorMessage = [errorMessage];
      }
      errorMessage.forEach((errorMessage) => expect(text).to.contain(errorMessage));
    });
  cy.wait(Cypress.env('demoDelay'));
};
