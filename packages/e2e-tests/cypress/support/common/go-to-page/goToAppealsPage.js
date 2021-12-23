export const goToAppealsPage = (url) =>{
    cy.wrap(`${Cypress.env('APPEALS_BASE_URL')}/${url}`).then((url)=>{
    cy.visit(url,{failOnStatusCode: false});
  });
}
