module.exports = () => {
  cy.get('#site-ownership').click();

  cy.snapshot();
};
