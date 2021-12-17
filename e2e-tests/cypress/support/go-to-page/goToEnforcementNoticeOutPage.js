module.exports = () => {
  cy.visit('/eligibility/enforcement-notice-out');
  cy.wait(Cypress.env('demoDelay'));
};
