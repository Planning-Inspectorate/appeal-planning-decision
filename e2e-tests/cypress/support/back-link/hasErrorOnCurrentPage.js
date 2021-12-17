module.exports = () => {
  cy.goToPlanningApplicationNumberPage();

  // submit the form without any input - invalid
  cy.clickSaveAndContinue();

  // see error
  cy.get('[data-cy="error-wrapper"]').should('exist');
};
