export const answerDoesNotOwnTheWholeAppeal= () => {
  cy.get('#site-ownership-2').click();

  //cy.wait(Cypress.env('demoDelay'));
};
