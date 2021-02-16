module.exports = () => {
  // confirm we are in the right place
  cy.url().should('include', '/appellant-submission/site-ownership');

  // pause long enough to capture a nice video
  cy.snapshot();
};
