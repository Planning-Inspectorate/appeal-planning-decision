module.exports = () => {
  // We check the privacy safety box
  cy.get('#does-not-include-sensitive-information').click();
  cy.wait(Cypress.env('demoDelay'));
};
