module.exports = () => {
  cy.visit('/appellant-submission/who-are-you');
  cy.wait(Cypress.env('demoDelay'));
};
