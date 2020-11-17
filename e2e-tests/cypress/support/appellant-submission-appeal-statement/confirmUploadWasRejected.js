// confirm that we are in the right place for a successfully-submitted appeal statement
module.exports = (errorMessage) => {
  // try to save and continue
  cy.get('.govuk-button').click();
  cy.wait(Cypress.env('demoDelay'));

  // confirm we are in the right place
  cy.url().should('include', '/appellant-submission/appeal-statement');

  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(errorMessage);
    });
  // pause long enough to capture a nice video
  cy.wait(Cypress.env('demoDelay'));
};
