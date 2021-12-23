export const provideAddressLine2 = (addressLine2) => {
  // provide the address line two
  cy.get('#site-address-line-two').type(`{selectall}{backspace}${addressLine2}`);

  //cy.wait(Cypress.env('demoDelay'));
};
