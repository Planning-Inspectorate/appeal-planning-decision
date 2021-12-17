module.exports = ({ expectedUrl }) => {
  cy.clickBackLink();

  cy.url().should('match', expectedUrl);
};
