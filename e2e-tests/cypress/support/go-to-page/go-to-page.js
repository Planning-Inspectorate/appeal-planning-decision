export const goToPage = (url) =>{
  cy.visit(url);
  cy.checkPageA11y({
    exclude: ['.govuk-radios__input'],
  }, null, callback);
}
