module.exports = (county) => {
  // provide the county
  cy.get('#site-county').type(`{selectall}{backspace}${county}`);

  cy.snapshot();
};
