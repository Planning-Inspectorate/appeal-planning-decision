// confirm that we are in the right place for a successfully-submitted decision date
module.exports = () => {
  // confirm we are in the right place
  cy.url().should('include', '/eligibility/decision-date');

  cy.get(".govuk-error-summary__list").invoke('text').then((text) => {
    expect(text).to.contain("You need to provide a date");
  });

  // pause long enough to capture a nice video
  cy.wait(Cypress.env('demoDelay'))
}
