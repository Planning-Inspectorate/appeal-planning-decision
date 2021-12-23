export const confirmNameValue = (name) => {
  cy.get('#appellant-name').should('have.value', name);
  //cy.wait(Cypress.env('demoDelay'));
};
