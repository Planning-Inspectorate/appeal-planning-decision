module.exports = () => {
  cy.visit('/eligibility/enforcement-notice');
  cy.wait(Cypress.env('demoDelay'));
};
