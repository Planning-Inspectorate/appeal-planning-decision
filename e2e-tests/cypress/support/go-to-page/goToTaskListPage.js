module.exports = (options = {}) => {
  cy.visit('/appellant-submission/task-list', { failOnStatusCode: false, ...options });
  cy.wait(Cypress.env('demoDelay'));
  //Accessibility Testing
  cy.checkPageA11y({
    // known issue: https://github.com/alphagov/govuk-frontend/issues/979
    exclude: ['.govuk-radios__input'],
  });
};
