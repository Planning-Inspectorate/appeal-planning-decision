module.exports = () => {
  cy.visit('/appellant-submission/site-access', { failOnStatusCode: false });
  cy.wait(Cypress.env('demoDelay'));

  cy.checkPageA11y({
    // known issue: https://github.com/alphagov/govuk-frontend/issues/979
    exclude: ['.govuk-radios__input'],
  });
};
