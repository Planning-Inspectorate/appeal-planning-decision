module.exports = () => {
  // go to the right page
  cy.visit('/appellant-submission/site-access-safety', { failOnStatusCode: false });
  cy.wait(Cypress.env('demoDelay'));
};
