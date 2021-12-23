export const confirmTextOnPage = (text) => {
  cy.contains(text);
  //cy.wait(Cypress.env('demoDelay'));
}
