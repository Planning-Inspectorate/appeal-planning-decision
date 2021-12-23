export const confirmCheckYourAnswersPage = () => {
  cy.url().should('include', '/appellant-submission/check-answers');
  //cy.wait(Cypress.env('demoDelay'));
};
