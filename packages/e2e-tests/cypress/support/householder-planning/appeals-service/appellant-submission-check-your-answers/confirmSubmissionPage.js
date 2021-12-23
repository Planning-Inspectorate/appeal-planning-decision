export const confirmSubmissionPage = () => {
  cy.url().should('include', '/appellant-submission/submission');
  //cy.wait(Cypress.env('demoDelay'));
};
