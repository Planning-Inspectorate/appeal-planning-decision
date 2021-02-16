module.exports = () => {
  cy.visit('/eligibility/no-decision');
  cy.snapshot();
};
