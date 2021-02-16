module.exports = () => {
  cy.get('#site-ownership-2').click();

  cy.snapshot();
};
