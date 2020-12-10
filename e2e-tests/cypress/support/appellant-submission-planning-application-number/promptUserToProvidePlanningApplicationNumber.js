module.exports = () => {
  cy.visit('/appellant-submission/application-number');

  cy.wait(Cypress.env('demoDelay'));
};
