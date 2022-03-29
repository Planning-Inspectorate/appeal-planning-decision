export const provideAddressLine1 = (addressLine1) => {
  if(addressLine1.length>=1)
  cy.get('#site-address-line-one').clear().type(addressLine1);
};
