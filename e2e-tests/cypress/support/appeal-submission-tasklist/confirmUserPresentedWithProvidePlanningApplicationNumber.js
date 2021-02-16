module.exports = () => {
  cy.url().should('contain','/appellant-submission/application-number');
  cy.snapshot();
};
