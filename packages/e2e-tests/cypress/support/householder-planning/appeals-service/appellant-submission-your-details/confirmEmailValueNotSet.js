export const confirmEmailValueNotSet = () => {
  cy.get('#appellant-email').should('have.value', '');
  cy.wait(Cypress.env('demoDelay'));
};
