export const confirmSiteOwnershipRejectedBecause = (errorMessage) => {
  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      if (!Array.isArray(errorMessage)) {
        errorMessage = [errorMessage];
      }
      errorMessage.forEach((errorMessage) => expect(text).to.contain(errorMessage));
    });
  cy.title().should('include', 'Error: ')
  // pause long enough to capture a nice video
  // cy.wait(Cypress.env('demoDelay'));
  // //Accessibility Testing
  // cy.checkPageA11y({
  //   // known issue: https://github.com/alphagov/govuk-frontend/issues/979
  //   //exclude: ['.govuk-radios__input'],
  // });
};
