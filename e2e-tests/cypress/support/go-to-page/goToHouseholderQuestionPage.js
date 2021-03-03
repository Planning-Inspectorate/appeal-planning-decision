module.exports = () => {
  cy.visit('/eligibility/householder-planning-permission');
  cy.wait(Cypress.env('demoDelay'));
};
