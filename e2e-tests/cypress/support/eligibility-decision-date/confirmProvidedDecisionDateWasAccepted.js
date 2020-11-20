// confirm that we are in the right place for a successfully-submitted decision date
module.exports = () => {
  // confirm we are in the right place
  cy.url().should('include', '/eligibility/planning-department');

  // pause long enough to capture a nice video
  cy.wait(Cypress.env('demoDelay'))
}
