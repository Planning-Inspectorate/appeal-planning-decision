export const confirmNameValueNotSet = () => {
  cy.get('#appellant-name').should('have.value', '');
  //cy.wait(Cypress.env('demoDelay'));
};
