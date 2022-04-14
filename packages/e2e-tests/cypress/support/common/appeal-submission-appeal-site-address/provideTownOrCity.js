export const provideTownOrCity = (townOrCity) => {
  if(townOrCity.length>=1)
  cy.get('#site-town-city').clear().type(townOrCity);
};
