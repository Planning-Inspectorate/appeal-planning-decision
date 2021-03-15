module.exports = (error) => {
  cy.url().should('include', '/eligibility/decision-date');
  cy.get(".govuk-error-summary__list").invoke('text').then((text) => {
    expect(text).to.contain(error);
  });
  cy.wait(Cypress.env('demoDelay'))
}
