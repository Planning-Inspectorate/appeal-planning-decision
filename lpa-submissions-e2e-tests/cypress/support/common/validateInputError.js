module.exports = (errorMessage, identifier) => {
  const node = cy.get(`[data-cy="${identifier}-error"]`)
  node.should('be.visible');
  node.invoke('text')
    .then(text => {
      expect(text).to.contain(errorMessage);
    })
}
