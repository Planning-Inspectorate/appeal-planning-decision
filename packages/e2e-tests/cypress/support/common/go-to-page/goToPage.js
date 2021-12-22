
export const goToPage = (url, options) =>{
  cy.visit(url, options);

  /*cy.checkPageA11y({
    exclude: ['.govuk-radios__input'],
  });*/
}
