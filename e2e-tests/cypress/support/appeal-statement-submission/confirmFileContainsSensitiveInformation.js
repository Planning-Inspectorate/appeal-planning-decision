module.exports = () => {
  cy.get('.govuk-error-summary__list').invoke('text').then((text) => {
    expect(text).to.contain('Confirm that your statement does not include sensitive information');
  });
  cy.snapshot();
};
