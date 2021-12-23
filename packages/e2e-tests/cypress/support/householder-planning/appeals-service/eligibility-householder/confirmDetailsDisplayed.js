export const confirmDetailsDisplayed = (label, text) => {
  cy.get(`[data-cy="${label}"]`).within(() => {
    cy.contains(text)
  })

  // cy.checkPageA11y({
  //   // known issue: https://github.com/alphagov/govuk-frontend/issues/979
  //   exclude: ['.govuk-radios__input'],
  // });
};
