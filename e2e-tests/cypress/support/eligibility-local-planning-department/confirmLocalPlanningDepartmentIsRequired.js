module.exports = (text) => {
  cy.get(".govuk-error-summary__list").invoke('text').then((text) => {
    expect(text).to.contain("Select the local planning department from the list");
  });

  cy.wait(Cypress.env('demoDelay'));
}
