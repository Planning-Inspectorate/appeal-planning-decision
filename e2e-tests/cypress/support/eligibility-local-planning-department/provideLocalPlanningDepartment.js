module.exports = (text) => {
  cy.get('input#planning-department-label').type(`{selectall}{backspace}${text}`);

  cy.snapshot();
};
