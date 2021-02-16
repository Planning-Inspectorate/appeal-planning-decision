module.exports = () => {
  cy.get('#appellant-name').should('have.value', '');
  cy.snapshot();
};
