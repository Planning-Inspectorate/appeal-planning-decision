
export const goToLPAPage = (url) =>{
  cy.get('@appeal').then((appeal)=>{
    cy.wrap(`${Cypress.env('LPA_BASE_URL')}/${appeal.id}/${url}`).then((url)=>{
      cy.visit(url);
    });

  });


  /*cy.checkPageA11y({
    exclude: ['.govuk-radios__input'],
  });*/
}
