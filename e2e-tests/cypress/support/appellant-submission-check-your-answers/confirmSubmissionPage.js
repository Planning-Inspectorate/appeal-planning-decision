module.exports = () => {
  // confirm we are in the right place
  cy.url().should('include', '/submission');

  // pause long enough to capture a nice video
  cy.wait(Cypress.env('demoDelay'));
};
