module.exports = () => {
  cy.get('.govuk-error-summary__list').invoke('text').then((text) => {
    expect(text).to.contain('The file must be smaller than');
  });
  cy.snapshot();
};
