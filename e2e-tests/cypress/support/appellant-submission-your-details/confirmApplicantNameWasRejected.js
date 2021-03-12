module.exports = (errorMessage) => {
  cy.url().should('include', '/appeal-householder-decision/applicant-name');
  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(errorMessage);
    });
  cy.wait(Cypress.env('demoDelay'));
};
