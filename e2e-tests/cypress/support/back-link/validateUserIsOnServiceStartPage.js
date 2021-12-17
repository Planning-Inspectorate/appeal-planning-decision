module.exports = () => {
  cy.url().should('match', /\/before-you-appeal$/);
};
