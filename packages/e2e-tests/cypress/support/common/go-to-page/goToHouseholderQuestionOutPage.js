module.exports = () => {
  cy.visit('/eligibility/householder-planning-permission-out');
  cy.wait(Cypress.env('demoDelay'));
};
