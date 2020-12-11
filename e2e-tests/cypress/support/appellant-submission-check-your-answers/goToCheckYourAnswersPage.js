module.exports = () => {
  cy.visit('/check-answers');
  cy.wait(Cypress.env('demoDelay'));
};
