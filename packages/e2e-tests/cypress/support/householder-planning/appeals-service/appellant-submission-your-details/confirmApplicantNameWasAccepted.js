export const confirmApplicantNameWasAccepted = () => {
  cy.url().should('include', '/appellant-submission/task-list');
 // cy.wait(Cypress.env('demoDelay'));
};
