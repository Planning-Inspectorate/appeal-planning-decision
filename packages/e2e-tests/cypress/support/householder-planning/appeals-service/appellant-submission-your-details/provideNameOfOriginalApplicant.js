export const provideNameOfOriginalApplicant = (name) => {
  if(name.length>=1)
  cy.get('#behalf-appellant-name').clear().type(name);
  //cy.wait(Cypress.env('demoDelay'));
};
