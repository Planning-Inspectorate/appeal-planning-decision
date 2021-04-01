module.exports = () => {
  cy.url().should('match', /\/eligibility\/planning-department$/);

  [
    /\/eligibility\/decision-date$/,
    /\/eligibility\/householder-planning-permission$/,
    /\/start-your-appeal$/,
  ].forEach((expectedUrl) => {
    cy.clickBackLinkAndValidateUrl({ expectedUrl });
  });
};
