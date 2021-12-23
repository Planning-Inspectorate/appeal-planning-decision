export const confirmProvidedAnswerIsDisplayed = () => {
  // -> confirm the expected state of the radio-buttons
  cy.get('#is-your-appeal-about-a-listed-building-2').should('be.checked');
  cy.get('#is-your-appeal-about-a-listed-building').should('not.be.checked');
};
