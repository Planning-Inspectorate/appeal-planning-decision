module.exports = () => {
  cy.get('.govuk-error-summary__list').invoke('text').then((text) => {
    expect(text).to.contain('Doc is the wrong file type:');
  });
  cy.snapshot();
};
