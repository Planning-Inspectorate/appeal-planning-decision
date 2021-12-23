export const provideDetailsName = (name) => {
  cy.get('#appellant-name').type(`{selectall}{backspace}${name}`);
  //cy.wait(Cypress.env('demoDelay'));
};
