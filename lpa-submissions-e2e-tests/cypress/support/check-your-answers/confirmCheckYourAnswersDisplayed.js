module.exports = (id, answer) => {
  cy.get(`[data-cy="${id}"]`)
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(answer);
    });
}
