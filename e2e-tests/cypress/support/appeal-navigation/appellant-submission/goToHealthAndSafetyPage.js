module.exports = () => {
  cy.visit('/appellant-submission/site-access-safety');
  cy.wait(Cypress.env('demoDelay'));
};
