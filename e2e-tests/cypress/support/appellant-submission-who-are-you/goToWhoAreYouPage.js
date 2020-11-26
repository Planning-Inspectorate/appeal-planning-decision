module.exports = () => {
  // go to the right page
  cy.visit('/appellant-submission/who-are-you');
  cy.wait(Cypress.env('demoDelay'));
};
