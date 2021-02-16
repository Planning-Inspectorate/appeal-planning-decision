module.exports = (details) => {
  // provide more details
  cy.get('#site-access-more-detail').type(`{selectall}{backspace}${details}`);

  cy.snapshot();
};
