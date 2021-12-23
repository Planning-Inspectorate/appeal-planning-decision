export const confirmHealthAndSafetyPage = () => {
  cy.url().should('contain', '/appellant-submission/site-access-safety');
  //cy.wait(Cypress.env('demoDelay'));
};
