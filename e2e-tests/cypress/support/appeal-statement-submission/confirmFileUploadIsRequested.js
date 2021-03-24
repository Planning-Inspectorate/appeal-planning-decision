module.exports = () => {
  cy.get('.govuk-error-summary__list').invoke('text').then((text) => {
    expect(text).to.contain('Upload the appeal statement');
  });
  cy.wait(Cypress.env('demoDelay'));
};
