module.exports = () => {
  cy.get('[data-cy="siteOwnership"]').click();
  cy.wait(Cypress.env('demoDelay'));

  cy.answerDoesNotOwnTheWholeAppeal();
  cy.clickSaveAndContinue();

  cy.answerHaveToldOtherOwnersAppeal();
  cy.clickSaveAndContinue();
};
