export const confirmNavigationDecisionDateExpiredPage = () => {
  cy.url().should('include', '/eligibility/decision-date-passed');
  // cy.wait(Cypress.env('demoDelay'));
  // cy.checkPageA11y({
  //   // known issue: https://github.com/alphagov/govuk-frontend/issues/979
  //   exclude: ['.govuk-radios__input'],
  // });
}
