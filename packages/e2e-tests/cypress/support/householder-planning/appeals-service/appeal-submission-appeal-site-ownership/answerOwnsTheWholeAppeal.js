export const answerOwnsTheWholeAppeal = () => {
  cy.get('#site-ownership').click();

  //cy.wait(Cypress.env('demoDelay'));
};
