module.exports = () => {
  // go to the right page
  cy.visit('/appellant-submission/site-access');
  cy.wait(Cypress.env('demoDelay'));
};
