module.exports = () => {
  cy.visit('eligibility/granted-or-refused-permission-out');
  cy.wait(Cypress.env('demoDelay'));
}
