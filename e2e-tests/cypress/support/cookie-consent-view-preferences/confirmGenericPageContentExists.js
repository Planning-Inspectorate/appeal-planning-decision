module.exports = () => {
  const expectedText =
    'Cookies are files saved on your phone, tablet or computer when you visit a website. We use cookies to store information about how you use the appeal a householder planning decision service, such as the pages you visit.';

  cy.get(`[data-cy="common-cookie-information"]`).contains(expectedText);
  cy.wait(Cypress.env('demoDelay'));
  cy.checkPageA11y({
    // known issue: https://github.com/alphagov/govuk-frontend/issues/979
    exclude: ['.govuk-radios__input'],
  });
};
