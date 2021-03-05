module.exports = (listItem) =>{
  const listIdentifier = listItem.toLowerCase().split(' ').join('-');

  cy.get(`[data-cy="guidance-page-nav--${listIdentifier}"]`).first().click();

  cy.wait(Cypress.env('demoDelay'));
}
