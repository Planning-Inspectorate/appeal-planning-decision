export const provideCounty = (county) => {
  // provide the county
  cy.get('#site-county').type(`{selectall}{backspace}${county}`);

  //cy.wait(Cypress.env('demoDelay'));
};
