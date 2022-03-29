export const provideAddressLine2 = (addressLine2) => {
  if(addressLine2.length>=1)
  cy.get('#site-address-line-two').clear().type(addressLine2);
};
