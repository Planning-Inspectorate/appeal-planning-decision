module.exports = (email) => {
  cy.get('#appellant-email').type(`{selectall}{backspace}${email}`);
  cy.snapshot();
};
