module.exports = () => {
  cy.visit('/eligibility/planning-department-out');
  cy.wait(Cypress.env('demoDelay'));
};
