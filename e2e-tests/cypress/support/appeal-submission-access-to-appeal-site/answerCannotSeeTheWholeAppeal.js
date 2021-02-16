module.exports = () => {
  cy.get('#site-access-2').click();

  cy.snapshot();
};
