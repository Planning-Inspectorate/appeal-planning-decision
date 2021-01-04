module.exports = () => {
  cy.visit('/eligibility/listed-out');
  cy.wait(Cypress.env('demoDelay'));
};
