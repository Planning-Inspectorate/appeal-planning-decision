// confirm that we are in the right place for a successfully-submitted decision date
module.exports = () => {
  // confirm we are in the right place
  cy.url().should('include', '/eligibility/decision-date');

"The deadline for appeal has passed"
  cy.get("h1").invoke('text').then((text) => {
    expect(text).to.contain('The deadline for appeal has passed');
  });

  // pause long enough to capture a nice video
  cy.wait(Cypress.env('demoDelay'))
}
