module.exports = (errorMessage) => {
  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain('yes');
      expect(errorMessage).to.contain('Yes');
    });

  cy.url().should('include', '/appellant-submission/who-are-you');

  cy.title().should('match', /^Error: /);

  cy.wait(Cypress.env('demoDelay'));
  //Accessibility Testing
  cy.checkPageA11y({
    // known issue: https://github.com/alphagov/govuk-frontend/issues/979
    exclude: ['.govuk-radios__input'],
  });
};
