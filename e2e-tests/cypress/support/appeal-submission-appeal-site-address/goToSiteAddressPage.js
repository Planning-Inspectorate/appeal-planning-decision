module.exports = () => {
  cy.visit('/appellant-submission/site-location');
  cy.wait(Cypress.env('demoDelay'));
};
