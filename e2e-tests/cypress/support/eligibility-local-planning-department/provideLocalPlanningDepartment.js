module.exports = (text) => {
  cy.get('input#local-planning-department').type(`{selectall}{backspace}${text}`);

  cy.wait(Cypress.env('demoDelay'));
};
