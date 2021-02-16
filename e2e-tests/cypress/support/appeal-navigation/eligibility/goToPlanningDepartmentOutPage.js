module.exports = () => {
  cy.visit('/eligibility/planning-department-out', {failOnStatusCode: false});
  cy.snapshot();
};
