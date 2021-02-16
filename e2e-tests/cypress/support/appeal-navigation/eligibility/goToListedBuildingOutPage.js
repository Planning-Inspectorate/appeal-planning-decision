module.exports = () => {
  cy.visit('/eligibility/listed-out', {failOnStatusCode: false});
  cy.snapshot();
};
