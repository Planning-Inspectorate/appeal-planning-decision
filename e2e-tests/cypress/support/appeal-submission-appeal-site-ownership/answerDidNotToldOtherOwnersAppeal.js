module.exports = () => {
  cy.get('#have-other-owners-been-told-no').click();

  cy.snapshot();
};
