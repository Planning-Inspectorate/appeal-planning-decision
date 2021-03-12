module.exports = () => {
  cy.visit('/appeal-householder-decision/submission-information');
  cy.wait(Cypress.env('demoDelay'));
};
