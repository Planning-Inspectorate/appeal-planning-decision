module.exports = () => {
  cy.get('h1')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain('Are you claiming for costs as part of your appeal?');
    });

  cy.snapshot();

  // prove that the entered data is retained during navigation
  // -> use the provided 'back' button
  cy.get('[data-cy="back"]').click();
  // -> confirm the expected state of the radio-buttons
  cy.get('#is-your-appeal-about-a-listed-building-2').should('be.checked');
  cy.get('#is-your-appeal-about-a-listed-building').should('not.be.checked');
  cy.snapshot();
};
