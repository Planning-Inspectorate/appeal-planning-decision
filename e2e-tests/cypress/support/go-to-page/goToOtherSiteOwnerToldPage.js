module.exports = () => {
  cy.visit('/appeal-householder-decision/site-ownership-certb');
  cy.wait(Cypress.env('demoDelay'));
};
