module.exports = () => {
  cy.get('h1')
    .invoke('text')
    .then((text) => {
      expect(text).to.contain('Are you claiming for costs as part of your appeal?');
    });

  cy.wait(Cypress.env('demoDelay'));
};
