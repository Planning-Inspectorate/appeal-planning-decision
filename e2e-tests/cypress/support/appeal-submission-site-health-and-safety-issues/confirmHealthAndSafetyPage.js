module.exports = () => {
  cy.url().should('contain', '/appellant-submission/site-access-safety');
  cy.snapshot();
};
