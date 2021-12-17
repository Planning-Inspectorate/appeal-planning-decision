module.exports = () => {
  cy.url().should('match', /\/appellant-submission\/site-access$/);

  [
    /\/appellant-submission\/site-ownership-certb$/,
    /\/appellant-submission\/site-ownership$/,
    /\/appellant-submission\/check-answers$/,
  ].forEach((expectedUrl) => {
    cy.clickBackLinkAndValidateUrl({ expectedUrl });
  });
};
