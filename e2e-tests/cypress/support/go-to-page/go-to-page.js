export const goToPage = (url) =>{
  cy.visit(url);
  //cy.checkPageA11y();
}
