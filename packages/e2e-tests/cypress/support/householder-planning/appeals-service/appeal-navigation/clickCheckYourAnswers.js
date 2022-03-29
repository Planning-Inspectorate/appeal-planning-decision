export const clickCheckYourAnswers = () => {
  cy.get('[data-cy="checkYourAnswers"]').first().click();
};
