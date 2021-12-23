export const userIsNavigatedToPage = (page) => {
  cy.url().should('include', page);
  //cy.wait(Cypress.env('demoDelay'));
};
