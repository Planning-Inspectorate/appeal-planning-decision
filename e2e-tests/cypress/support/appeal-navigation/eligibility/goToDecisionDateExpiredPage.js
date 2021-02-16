module.exports = () => {
  cy.visit('/eligibility/decision-date-passed');
  cy.snapshot();
};
