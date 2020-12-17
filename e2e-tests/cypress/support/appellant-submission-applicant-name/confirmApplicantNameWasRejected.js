module.exports = (errorMessage) => {
  // confirm we are in the right place
  cy.url().should('include', '/appellant-submission/applicant-name');

  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(errorMessage);
    });
  // pause long enough to capture a nice video
  cy.wait(Cypress.env('demoDelay'));
};
