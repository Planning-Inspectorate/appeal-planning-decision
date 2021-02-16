module.exports = () => {
  cy.visit('/eligibility/appeal-statement', {failOnStatusCode: false});
  cy.snapshot();
};
