module.exports = () => {
  cy.visit('/eligibility/planning-department');
  cy.wait(Cypress.env('demoDelay'));
};
