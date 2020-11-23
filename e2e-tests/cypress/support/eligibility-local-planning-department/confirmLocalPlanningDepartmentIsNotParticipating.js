module.exports = (text) => {
  cy.get("h1").invoke('text').then((text) => {
    expect(text).to.contain("This service is not available in your area");
  });

  cy.wait(Cypress.env('demoDelay'));
}
