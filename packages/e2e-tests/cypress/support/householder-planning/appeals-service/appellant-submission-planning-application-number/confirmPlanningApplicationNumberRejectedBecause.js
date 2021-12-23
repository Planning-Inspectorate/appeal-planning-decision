export const confirmPlanningApplicationNumberRejectedBecause = (errorMessage) => {
  cy.get('.govuk-error-summary__list')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain(errorMessage);
    });
  cy.title().should('match', /^Error: /);
};
