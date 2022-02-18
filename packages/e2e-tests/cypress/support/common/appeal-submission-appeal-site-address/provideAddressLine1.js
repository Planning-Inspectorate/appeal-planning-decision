export const provideAddressLine1 = (addressLine1) => {
  // provide the address line one
  cy.get('#site-address-line-one').type(`{selectall}{backspace}${addressLine1}`);
};
