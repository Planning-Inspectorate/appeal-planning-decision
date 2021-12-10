export const visibleWithoutText = (textToFind, selector) => {
  cy.get(selector)
    .invoke('text')
    .then((text) => {
      expect(text).not.to.contain(textToFind);
    });
};
