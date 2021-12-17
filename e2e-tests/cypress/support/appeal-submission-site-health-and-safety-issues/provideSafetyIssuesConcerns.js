module.exports = (issues) => {
  cy.get('#site-access-safety-concerns').type(`{selectall}{backspace}${issues}`);
  cy.wait(Cypress.env('demoDelay'));
};
