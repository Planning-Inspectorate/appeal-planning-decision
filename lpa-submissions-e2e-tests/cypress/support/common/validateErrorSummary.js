module.exports = (errorMessage, identifier) => {
  const node = cy.get(`a[href="#${identifier}"]`)
  node.should('be.visible');
  node.invoke('text')
    .then(text => {
      expect(text).to.contain(errorMessage);
    })
}
