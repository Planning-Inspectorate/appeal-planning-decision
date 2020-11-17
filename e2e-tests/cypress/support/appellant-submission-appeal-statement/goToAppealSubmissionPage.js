module.exports = () => {
  // go to the right page
  cy.visit('/appellant-submission/appeal-statement');
  cy.wait(Cypress.env('demoDelay'));
};
