module.exports = () => {
  cy.visit('/eligibility/planning-department', {failOnStatusCode: false});
  cy.wait(Cypress.env('demoDelay'));
};
