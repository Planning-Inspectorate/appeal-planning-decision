export const provideDetailsEmail = (email) => {
  cy.get('#appellant-email').type(`{selectall}{backspace}${email}`);
  //cy.wait(Cypress.env('demoDelay'));
};
