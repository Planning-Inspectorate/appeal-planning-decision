export const provideCounty = (county) => {
  if(county.length>=1)
  cy.get('#site-county').clear().type(county);
};
