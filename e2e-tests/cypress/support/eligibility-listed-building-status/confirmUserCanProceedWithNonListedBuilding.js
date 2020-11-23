module.exports = () => {
  cy.get("h1").invoke('text').then((text) => {
    expect(text).to.contain("Your appeal statement");
  });

  cy.wait(Cypress.env('demoDelay'));
}
