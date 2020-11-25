module.exports = () => {
  // go to the right page
  cy.visit('/appellant-submission/your-details');
  cy.wait(Cypress.env('demoDelay'));
};
