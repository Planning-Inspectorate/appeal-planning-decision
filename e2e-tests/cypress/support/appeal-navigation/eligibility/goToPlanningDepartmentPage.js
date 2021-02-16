module.exports = () => {
  cy.visit('/eligibility/planning-department', {failOnStatusCode: false});
  cy.snapshot();
};
