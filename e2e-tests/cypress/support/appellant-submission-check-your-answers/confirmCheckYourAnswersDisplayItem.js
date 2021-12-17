module.exports = (identifier, expected) => {
  cy.get(identifier)
    .invoke('text')
    .then((text) => {
      expect(text).to.eq(expected);
    });
  cy.wait(Cypress.env('demoDelay'));
};
