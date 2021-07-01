module.exports = () => {
  cy.get('#original-application-your-name').click();
  cy.wait(Cypress.env('demoDelay'));
};
