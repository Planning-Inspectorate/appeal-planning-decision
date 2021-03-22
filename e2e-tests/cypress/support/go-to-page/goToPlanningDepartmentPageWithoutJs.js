module.exports = () => {
  cy.visit('/eligibility/planning-department', { script: false });
  cy.wait(Cypress.env('demoDelay'));
};
