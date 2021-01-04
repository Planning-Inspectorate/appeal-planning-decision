module.exports = () => {
  cy.visit('/appellant-submission/your-details');
  cy.wait(Cypress.env('demoDelay'));
};
