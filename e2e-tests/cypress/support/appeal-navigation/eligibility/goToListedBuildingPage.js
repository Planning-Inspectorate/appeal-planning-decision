module.exports = () => {
  cy.visit('/eligibility/listed-building', {failOnStatusCode: false});
  cy.snapshot();
};
