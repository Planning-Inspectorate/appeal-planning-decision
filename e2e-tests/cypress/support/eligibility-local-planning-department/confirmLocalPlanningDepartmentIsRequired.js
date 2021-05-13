module.exports = (text) => {
  cy.get(".govuk-error-summary__list").invoke('text').then((text) => {
    expect(text).to.contain("Select the local planning department from the list");
  });
  cy.title().should('match', /^Error: /);
  cy.wait(Cypress.env('demoDelay'));
  cy.checkPageA11y({
    // known issue: https://github.com/alphagov/govuk-frontend/issues/979
    exclude: ['.govuk-radios__input'],
  });
}
