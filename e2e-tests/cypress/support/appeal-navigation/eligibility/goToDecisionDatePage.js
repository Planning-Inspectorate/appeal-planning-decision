module.exports = () => {
  cy.visit('/eligibility/decision-date');
  cy.snapshot();
};
