export const goToCheckYourAnswersPage = (options = {}) => {
  cy.visit('/appellant-submission/check-answers', { failOnStatusCode: false, ...options });
  cy.wait(Cypress.env('demoDelay'));
};
