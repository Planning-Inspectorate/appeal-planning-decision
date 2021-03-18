module.exports = (overrides = {}) => {
  cy.visit('/eligibility/householder-planning-permission', overrides);
  cy.wait(Cypress.env('demoDelay'));
};
