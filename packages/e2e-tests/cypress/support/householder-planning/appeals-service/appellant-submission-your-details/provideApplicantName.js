export const provideApplicantName = (name) => {
  cy.get('#behalf-appellant-name').type(`{selectall}{backspace}${name}`);
 // cy.wait(Cypress.env('demoDelay'));
};
