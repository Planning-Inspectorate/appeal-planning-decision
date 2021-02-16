module.exports = (email) => {
  cy.get('#appellant-email').should('have.value', email);
  cy.snapshot();
};
