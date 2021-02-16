module.exports = (name) => {
  cy.get('#appellant-name').type(`{selectall}{backspace}${name}`);
  cy.snapshot();
};
