module.exports = () => {
  cy.url().should('include', '/eligibility/decision-date');
  cy.get(".govuk-error-summary__list").invoke('text').then((text) => {
    expect(text).to.contain("You need to provide a date");
  });
  cy.wait(Cypress.env('demoDelay'))
}
