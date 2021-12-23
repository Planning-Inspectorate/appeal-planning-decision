export const provideNameOfOriginalApplicant = (name) => {
  cy.get('#behalf-appellant-name').type(`{selectall}{backspace}${name}`);
  //cy.wait(Cypress.env('demoDelay'));
};
