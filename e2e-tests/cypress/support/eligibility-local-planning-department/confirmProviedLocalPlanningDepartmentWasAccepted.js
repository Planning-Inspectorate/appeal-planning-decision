module.exports = (text) => {
  cy.url().should('include', '/eligibility/listed-building');

  // pause long enough to capture a nice video
  cy.wait(Cypress.env('demoDelay'))
}
