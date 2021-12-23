export const confirmAppealSubmitted = () => {
  cy.url().should('include', '/appellant-submission/confirmation');
  //cy.wait(Cypress.env('demoDelay'));
};
