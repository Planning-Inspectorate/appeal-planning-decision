module.exports = (text) => {
  cy.url().should('include', '/eligibility/listed-building');

  cy.snapshot();
};
