export const provideAnswerNo = () => {
  cy.get('#original-application-your-name-2').click();
  //cy.wait(Cypress.env('demoDelay'));
};
