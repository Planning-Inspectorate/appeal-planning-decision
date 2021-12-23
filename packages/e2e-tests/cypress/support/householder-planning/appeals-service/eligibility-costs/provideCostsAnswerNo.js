export const provideCostsAnswerNo = () => {
  cy.get('[data-cy="answer-no"]').click();
  //cy.wait(Cypress.env('demoDelay'));
};
