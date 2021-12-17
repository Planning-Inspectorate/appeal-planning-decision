module.exports = () => {
  cy.visit('/appellant-submission/site-ownership-certb');
  cy.wait(Cypress.env('demoDelay'));
};
