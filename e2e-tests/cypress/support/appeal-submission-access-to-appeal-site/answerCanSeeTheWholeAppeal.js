module.exports = () => {
  cy.get('#site-access').click();

  cy.snapshot();
};
