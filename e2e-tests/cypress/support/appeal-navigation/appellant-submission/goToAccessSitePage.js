module.exports = () => {
  // go to the right page
  cy.visit('/appellant-submission/site-access', {failOnStatusCode: false});
  cy.snapshot();
};
