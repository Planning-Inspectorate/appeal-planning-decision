module.exports = (name) => {
  cy.get('#appellant-name').should('have.value', name);
  cy.snapshot();
};
