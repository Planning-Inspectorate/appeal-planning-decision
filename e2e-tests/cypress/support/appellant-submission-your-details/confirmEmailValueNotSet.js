module.exports = () => {
  cy.get('#appellant-email').should('have.value', '');
  cy.snapshot();
};
