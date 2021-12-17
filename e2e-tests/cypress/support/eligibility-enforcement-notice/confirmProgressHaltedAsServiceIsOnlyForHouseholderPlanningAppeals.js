module.exports = () => {
  // confirm we are in the right place
  cy.url().should('include', '/eligibility/enforcement-notice-out');

  cy.title().should(
    'eq',
    'This service is only for appeals without an enforcement notice - Eligibility - Appeal a householder planning decision - GOV.UK',
  );
  cy.get('[data-cy="enforcement-notice-out"]').should('exist');

  // pause long enough to capture a nice video
  cy.wait(Cypress.env('demoDelay'));
  //Accessibility testing
  cy.checkPageA11y({
    // known issue: https://github.com/alphagov/govuk-frontend/issues/979
    exclude: ['.govuk-radios__input'],
  });
};
