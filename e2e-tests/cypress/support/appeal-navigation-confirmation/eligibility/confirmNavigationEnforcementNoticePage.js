module.exports = () => {
  cy.url().should('include', '/eligibility/enforcement-notice');
  cy.snapshot();
};
