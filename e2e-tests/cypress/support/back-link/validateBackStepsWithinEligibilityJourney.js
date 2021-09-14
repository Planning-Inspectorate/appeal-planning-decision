module.exports = () => {
  cy.url().should('match', /\/eligibility\/planning-department$/);

  [
    /\/eligibility\/decision-date$/,
    /\/eligibility\/granted-or-refused-permission$/,
    /\/eligibility\/householder-planning-permission$/,
    /\/start-your-appeal$/,
  ].forEach((expectedUrl) => {
    cy.clickBackLinkAndValidateUrl({ expectedUrl });
  });
};
