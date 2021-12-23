export const confirmUserCanProceedWithNonListedBuilding = () => {
  cy.get('h1')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain('Are you claiming for costs as part of your appeal?');
    });

  // //Accessibility Testing
  // cy.checkPageA11y({
  //   // known issue: https://github.com/alphagov/govuk-frontend/issues/979
  //   exclude: ['.govuk-radios__input'],
  // });
};
