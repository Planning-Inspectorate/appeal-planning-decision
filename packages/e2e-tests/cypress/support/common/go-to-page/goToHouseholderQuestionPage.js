module.exports = (options = {}) => {
  cy.visit('/eligibility/householder-planning-permission', options);
  cy.wait(Cypress.env('demoDelay'));
};
