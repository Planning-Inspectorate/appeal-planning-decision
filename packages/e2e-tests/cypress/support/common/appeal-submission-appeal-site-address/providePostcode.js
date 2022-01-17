export const providePostcode = (postcode) => {
  // provide the postcode
  cy.get('#site-postcode').type(`{selectall}{backspace}${postcode}`);

  //cy.wait(Cypress.env('demoDelay'));
};
