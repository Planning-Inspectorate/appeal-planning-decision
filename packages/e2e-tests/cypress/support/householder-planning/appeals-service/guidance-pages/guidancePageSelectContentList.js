export const guidancePageSelectContentList = (listItem) =>{
  const listIdentifier = listItem.toLowerCase().split(' ').join('-');

  cy.get(`[data-cy="guidance-page-nav--${listIdentifier}"]`).first().click();
}
