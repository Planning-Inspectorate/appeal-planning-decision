module.exports = () => {
  cy.get("h1").invoke('text').then((text) => {
    expect(text).to.contain("Your appeal statement");
  });

  cy.wait(Cypress.env('demoDelay'));

  // prove that the entered data is retained during navigation
  // -> use the provided 'back' button
  cy.get('[data-cy="back"]').click();
  // -> confirm the expected state of the radio-buttons
  cy.get('#is-your-appeal-about-a-listed-building-2').should('be.checked');
  cy.get('#is-your-appeal-about-a-listed-building').should('not.be.checked');
  cy.wait(Cypress.env('demoDelay'));
}
