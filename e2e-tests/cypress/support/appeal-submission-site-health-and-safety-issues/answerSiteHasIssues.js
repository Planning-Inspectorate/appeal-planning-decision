module.exports = () => {
  cy.get('#site-access-safety').click();
  cy.snapshot();
};
