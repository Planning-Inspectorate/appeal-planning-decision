export const provideNameOfOriginalApplicant = (name) => {
  cy.get('#behalf-appellant-name').clear().type(name);
  //cy.wait(Cypress.env('demoDelay'));
};
