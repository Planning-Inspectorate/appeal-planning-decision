export const providePostcode = (postcode) => {
  if(postcode.length>=1)
  cy.get('#site-postcode').clear().type(postcode);
};
