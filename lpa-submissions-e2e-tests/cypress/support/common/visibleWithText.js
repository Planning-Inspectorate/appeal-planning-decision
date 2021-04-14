module.exports = (textToFind, selector) => {
  cy.get(selector).invoke('text').then((text) => {
    expect(text).to.contain(textToFind);
  });
};
