module.exports = () => {
  cy.get(".govuk-error-summary__list").invoke('text').then((text) => {
    expect(text).to.contain("Select yes if your appeal is about a listed building");
  });

  cy.snapshot();
}
