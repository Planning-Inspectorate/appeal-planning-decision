module.exports = () => {
  // We check the privacy safety box
  cy.get('#privacy-safe').click();
  cy.wait(Cypress.env('demoDelay'));
};
