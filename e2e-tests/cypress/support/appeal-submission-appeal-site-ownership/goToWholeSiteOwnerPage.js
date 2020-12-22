module.exports = () => {
  cy.visit('/appellant-submission/site-ownership');
  cy.wait(Cypress.env('demoDelay'));
};
