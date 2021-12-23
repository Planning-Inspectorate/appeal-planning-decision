export const answerHaveToldOtherOwnersAppeal = () => {
  cy.get('input[data-cy="answer-yes"]').check();
  //cy.wait(Cypress.env('demoDelay'));
};
