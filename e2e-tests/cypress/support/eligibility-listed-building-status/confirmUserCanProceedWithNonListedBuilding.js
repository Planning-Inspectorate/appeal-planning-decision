module.exports = () => {
  cy.get('h1')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain('Are you claiming for costs as part of your appeal?');
    });

  cy.wait(Cypress.env('demoDelay'));
  //Accessibility Testing
  cy.checkPageA11y({
    // known issue: https://github.com/alphagov/govuk-frontend/issues/979
    exclude: ['.govuk-radios__input'],
  });
};
