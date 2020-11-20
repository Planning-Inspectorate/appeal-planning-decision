module.exports = () => {
  cy.visit('/appellant-submission/appeal-statement');
  cy.wait(Cypress.env('demoDelay'));
};
