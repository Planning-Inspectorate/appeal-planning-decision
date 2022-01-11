export const goToAppealsPage = (url, options) =>{
    cy.wrap(`${Cypress.env('APPEALS_BASE_URL')}/${url}`).then((url)=>{
    if(options){
      options.failOnStatusCode = false;
    }
    else {
      options = {failOnStatusCode: false};
    }
      cy.visit(url,options);
  });
}
