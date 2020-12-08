module.exports = () => {
  cy.get(".govuk-error-summary__list").invoke('text').then((text) => {
    expect(text).to.contain("Confirm that you agree with the terms and conditions");
  });

  cy.wait(Cypress.env('demoDelay'));
};
