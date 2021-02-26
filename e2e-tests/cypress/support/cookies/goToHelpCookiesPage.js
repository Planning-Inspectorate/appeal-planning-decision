module.exports = () => {
  cy.visit('/help/cookies');
  cy.wait(Cypress.env('demoDelay'));
};
