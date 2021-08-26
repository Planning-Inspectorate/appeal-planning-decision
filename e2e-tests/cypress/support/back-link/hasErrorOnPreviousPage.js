module.exports = () => {
  cy.goToPlanningApplicationNumberPage();

  // submit the form without any input
  cy.clickSaveAndContinue();

  // invalid, see error
  cy.confirmPlanningApplicationNumberRejectedBecause('Enter the original planning application number');
  cy.get('[data-cy="error-wrapper"]').should('exist');

  // now submit the valid form
  cy.providePlanningApplicationNumber('FirstNumber/12345');
  cy.clickSaveAndContinue();
};
