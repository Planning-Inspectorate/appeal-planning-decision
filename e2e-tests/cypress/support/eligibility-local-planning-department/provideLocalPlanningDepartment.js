module.exports = (text) => {
  cy.get('input#planning-department-label').type(`{selectall}{backspace}${text}`);

  cy.wait(Cypress.env('demoDelay'));
};
